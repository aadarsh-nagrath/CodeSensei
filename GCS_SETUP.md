# Google Cloud Storage Setup Guide (Workload Identity)

This guide will help you set up Google Cloud Storage for profile image uploads in CodeSensei using **Workload Identity** - the most secure and recommended approach for GCP deployments.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Cloud project
3. Your application running on GCP (VM, GKE, Cloud Run, etc.)

## Why Workload Identity?

✅ **Most Secure**: No key files to manage or rotate  
✅ **Automatic**: GCP injects temporary credentials  
✅ **Best Practice**: Recommended by Google Cloud  
✅ **Zero Maintenance**: No credential management needed  

## Setup Steps

### 1. Create a Google Cloud Storage Bucket

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **Cloud Storage** > **Buckets**
4. Click **Create Bucket**
5. Choose a unique bucket name (e.g., `codesensei-profile-images`)
6. Select a location for your bucket
7. Choose **Standard** storage class
8. Set access control to **Uniform**
9. Click **Create**

### 2. Create a Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Enter a name (e.g., `codesensei-storage`)
4. Add a description: "Service account for CodeSensei profile image uploads"
5. Click **Create and Continue**
6. Grant the following roles:
   - **Storage Object Admin** (for full access to objects)
7. Click **Continue** and then **Done**

### 3. Configure Workload Identity

#### For Google Kubernetes Engine (GKE):

1. **Enable Workload Identity** on your cluster:
   ```bash
   gcloud container clusters update CLUSTER_NAME \
     --workload-pool=PROJECT_ID.svc.id.goog \
     --zone=ZONE
   ```

2. **Create a Kubernetes Service Account**:
   ```bash
   kubectl create serviceaccount codesensei-storage \
     --namespace default
   ```

3. **Bind the GCP Service Account to K8s Service Account**:
   ```bash
   gcloud iam service-accounts add-iam-policy-binding \
     --role roles/iam.workloadIdentityUser \
     --member "serviceAccount:PROJECT_ID.svc.id.goog[default/codesensei-storage]" \
     codesensei-storage@PROJECT_ID.iam.gserviceaccount.com
   ```

4. **Annotate the K8s Service Account**:
   ```bash
   kubectl annotate serviceaccount codesensei-storage \
     --namespace default \
     iam.gke.io/gcp-service-account=codesensei-storage@PROJECT_ID.iam.gserviceaccount.com
   ```

5. **Update your deployment** to use the service account:
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: codesensei
   spec:
     template:
       spec:
         serviceAccountName: codesensei-storage
         containers:
         - name: codesensei
           image: your-image
           env:
           - name: GOOGLE_CLOUD_PROJECT_ID
             value: "your-project-id"
           - name: GOOGLE_CLOUD_BUCKET_NAME
             value: "your-bucket-name"
   ```

#### For Compute Engine (VM):

1. **Create the VM with the service account**:
   ```bash
   gcloud compute instances create codesensei-vm \
     --service-account=codesensei-storage@PROJECT_ID.iam.gserviceaccount.com \
     --scopes=https://www.googleapis.com/auth/cloud-platform \
     --image-family=ubuntu-2004-lts \
     --image-project=ubuntu-os-cloud
   ```

2. **Set environment variables** on the VM:
   ```bash
   export GOOGLE_CLOUD_PROJECT_ID="your-project-id"
   export GOOGLE_CLOUD_BUCKET_NAME="your-bucket-name"
   ```

#### For Cloud Run:

1. **Deploy with the service account**:
   ```bash
   gcloud run deploy codesensei \
     --image=your-image \
     --service-account=codesensei-storage@PROJECT_ID.iam.gserviceaccount.com \
     --set-env-vars="GOOGLE_CLOUD_PROJECT_ID=your-project-id,GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name"
   ```

### 4. Configure Environment Variables

Add the following variables to your deployment configuration:

```env
# Google Cloud Storage (Workload Identity)
GOOGLE_CLOUD_PROJECT_ID=your_project_id_here
GOOGLE_CLOUD_BUCKET_NAME=your_bucket_name_here
# Note: No GOOGLE_APPLICATION_CREDENTIALS needed!
```

### 5. Make Bucket Public (Optional)

If you want images to be publicly accessible:

1. Go to your bucket in the Google Cloud Console
2. Click on the **Permissions** tab
3. Click **Add Principal**
4. Add `allUsers` as a principal
5. Grant the **Storage Object Viewer** role
6. Click **Save**

## Security Benefits

✅ **No Key Files**: Eliminates the risk of exposed credentials  
✅ **Automatic Rotation**: GCP handles credential rotation  
✅ **Least Privilege**: Service account has only necessary permissions  
✅ **Audit Trail**: All access is logged in Cloud Audit Logs  
✅ **Zero Maintenance**: No manual credential management  

## Testing

Once configured, you can test the image upload functionality by:

1. Opening the profile drawer
2. Hovering over the avatar
3. Clicking the upload button
4. Selecting an image file
5. The image should upload and display in the profile

## Troubleshooting

### Common Issues

1. **Authentication Error**: 
   - Verify the service account is attached to your workload
   - Check that Workload Identity is properly configured
   - Ensure the service account has Storage Object Admin role

2. **Bucket Not Found**: 
   - Verify the bucket name and that it exists in your project
   - Check the GOOGLE_CLOUD_PROJECT_ID environment variable

3. **Permission Denied**: 
   - Ensure the service account has Storage Object Admin role
   - Verify Workload Identity binding is correct

4. **File Upload Fails**: 
   - Check file size (max 5MB) and format (JPEG, PNG, GIF, WebP only)
   - Verify bucket permissions and public access settings

### Debug Mode

Enable debug logging by adding console.log statements in the upload API endpoint to see detailed error messages.

### Verification Commands

Test your setup with these commands:

```bash
# Test GCS access from your workload
gcloud storage ls gs://your-bucket-name/

# Check service account permissions
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:codesensei-storage@PROJECT_ID.iam.gserviceaccount.com"
```

## Migration from Key Files

If you're migrating from service account key files:

1. Remove `GOOGLE_APPLICATION_CREDENTIALS` from your environment
2. Delete the JSON key file (it's no longer needed)
3. Follow the Workload Identity setup above
4. Test the application to ensure everything works

This approach is much more secure and follows Google Cloud best practices!
