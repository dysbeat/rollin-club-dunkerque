- Have a bucket accessible from Nico and me where articles are put
- Articles will be written in a specific markup language (markdown?)
- a scheduled task will also be performed to upload the results of the competition to this bucket in a specific folder
- A job will construct the static website from this bucket, and the resources in the github respository
    * it will start if a change in the github repository is seen
    * or if a change in the bucket has been made
- Once the job is finished, it will output to a new bucket
- The bucket will be integration tested
- After human approval it will copy this bucket to the public bucket storing the actual website