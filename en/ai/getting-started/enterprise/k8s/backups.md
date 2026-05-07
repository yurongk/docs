---
title: Daily Database Backup
sidebar_position: 1
---

## Prerequisites
Install Meta Analysis Cloud according to the official documentation and ensure it runs in the Kubernetes cluster.

## Creating a Backup Strategy

### Configure Kubernetes CronJob
Kubernetes CronJob can be used to perform backup tasks regularly.

### Create a Backup Script
Write a script to back up the PostgreSQL database:
```sh
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d%H%M)
BACKUP_DIR="/backups"
BACKUP_FILE="$BACKUP_DIR/postgres-backup-$DATE.sql"

mkdir -p $BACKUP_DIR

# Perform the backup
pg_dump -h postgres -U metad_user metad_db > $BACKUP_FILE

# Delete backups older than 30 days
find $BACKUP_DIR -type f -name "*.sql" -mtime +30 -exec rm {} \;
```

### Configure Storage Location
Ensure the backup storage location has sufficient space and permissions, such as using a PersistentVolume.

## 4. Implement Backup

### Write Kubernetes CronJob Configuration File
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
spec:
  schedule: "0 2 * * *" # Run at 2 AM every day
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:13
            volumeMounts:
            - name: backup-storage
              mountPath: /backups
            - name: backup-script
              mountPath: /scripts
            command: ["/bin/bash", "/scripts/backup.sh"]
            env:
            - name: PGHOST
              value: "postgres"
            - name: PGUSER
              value: "metad_user"
            - name: PGPASSWORD
              value: "metad_pass"
          restartPolicy: OnFailure
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
          - name: backup-script
            configMap:
              name: backup-script
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: backup-script
data:
  backup.sh: |
    #!/bin/bash
    DATE=$(date +%Y%m%d%H%M)
    BACKUP_DIR="/backups"
    BACKUP_FILE="$BACKUP_DIR/postgres-backup-$DATE.sql"

    mkdir -p $BACKUP_DIR

    pg_dump -h postgres -U metad_user metad_db > $BACKUP_FILE

    find $BACKUP_DIR -type f -name "*.sql" -mtime +30 -exec rm {} \;
```

#### Deploy CronJob
1. Create a PersistentVolumeClaim:
   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: backup-pvc
   spec:
     accessModes:
       - ReadWriteOnce
     resources:
       requests:
         storage: 5Gi
   ```

2. Create and apply CronJob and ConfigMap files:
   ```sh
   kubectl apply -f backup-pvc.yaml
   kubectl apply -f backup-cronjob.yaml
   ```

## 5. Verify Backup

### Check Backup Files
Check the specified backup directory to ensure the backup files exist and their sizes are reasonable.

### Verify Backup Integrity
Restore the backup files to a test database to verify their integrity.

### Regularly Test Restores
Regularly restore data from backups to ensure the backup strategy is effective.

## 6. Restore Backup Data

### Overview of Restore Process
Restoring data is crucial to ensure data availability. In case of data loss or corruption, you can restore the database to a previous state using the backup data. The following steps describe how to restore a PostgreSQL database from backup files on the Kubernetes platform.

### Prepare the Restore Environment
1. Ensure the Kubernetes cluster is running normally.
2. Ensure the backup files are available and stored in an accessible location.

### Write a Restore Script
Write a script to restore the PostgreSQL database:
```sh
#!/bin/bash
# restore.sh
BACKUP_FILE=$1
if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

psql -h postgres -U metad_user -d metad_db < $BACKUP_FILE
```

### Execute the Restore Operation
1. Create a Kubernetes Job configuration file:
   ```yaml
   apiVersion: batch/v1
   kind: Job
   metadata:
     name: postgres-restore
   spec:
     template:
       spec:
         containers:
         - name: restore
           image: postgres:13
           volumeMounts:
           - name: backup-storage
             mountPath: /backups
           - name: restore-script
             mountPath: /scripts
           command: ["/bin/bash", "/scripts/restore.sh", "/backups/postgres-backup-<date>.sql"]
           env:
           - name: PGHOST
             value: "postgres"
           - name: PGUSER
             value: "metad_user"
           - name: PGPASSWORD
             value: "metad_pass"
         restartPolicy: OnFailure
         volumes:
         - name: backup-storage
           persistentVolumeClaim:
             claimName: backup-pvc
         - name: restore-script
           configMap:
             name: restore-script
   ---
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: restore-script
   data:
     restore.sh: |
       #!/bin/bash
       BACKUP_FILE=$1
       if [ -z "$BACKUP_FILE" ]; then
         echo "Usage: $0 <backup_file>"
         exit 1
       fi

       psql -h postgres -U metad_user -d metad_db < $BACKUP_FILE
   ```

2. Create and apply Job and ConfigMap files:
   ```sh
   kubectl apply -f restore-job.yaml
   ```

3. Monitor the Job execution status:
   ```sh
   kubectl get jobs --watch
   ```

### Verify Restore Results
1. Check the database contents to ensure the data has been restored correctly.
2. Execute database queries to verify data integrity and availability.

## 7. Automation and Monitoring

### Configure Backup Automation
Automate backup tasks using Kubernetes CronJob to ensure backups are performed on schedule.

### Set Up Monitoring and Alerts
Use tools like Prometheus and Grafana to monitor backup tasks and configure alerts to notify administrators in case of backup failures.

### Regular Maintenance and Optimization
Regularly check and optimize backup scripts, storage strategies, and restore processes to ensure the backup strategy is efficient and reliable.

## 8. Summary

### Review of Backup Strategy
Review the backup strategy described in this document, including writing backup scripts, configuring and deploying CronJobs, etc.

### Best Practices
Regularly verify the effectiveness of backups to ensure the stability and reliability of backup tasks.

### Common Issues and Solutions
List common issues and their solutions, such as large backup files, backup failures, etc.

By following the steps outlined above, you can implement daily backups and restores for PostgreSQL databases on the Kubernetes platform, ensuring data security and recoverability.