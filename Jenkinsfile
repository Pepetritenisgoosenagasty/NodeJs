pipeline {
    agent any

    parameters {
        booleanParam(name: 'executeDeploy', defaultValue: false, description: '')
    }

      stages {
          stage('build') {
              steps {
                  echo 'building the software'
                  echo 'executing yarn...'
                  nodejs('Node-18.4.0') {
                      sh 'yarn install'
                }
                 
              }
          }
          stage('test') {
              steps {
                  echo 'testing the software'
                //   sh 'npm test'
              }
          }

          stage('deploy') {
             when {
                expression {
                    params.executeDeploy
                }
             }
              steps {
                 echo 'deploying the software'
                // withCredentials([sshUserPrivateKey(credentialsId: "jenkins-ssh", keyFileVariable: 'sshkey')]){
                //   echo 'deploying the software'
                //   sh '''#!/bin/bash
                //   echo "Creating .ssh"
                //   mkdir -p /var/lib/jenkins/.ssh
                //   ssh-keyscan 164.92.218.220 >> /var/lib/jenkins/.ssh/known_hosts
                

                //   rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./ root@164.92.218.220:/app/
                 

                //   ssh -i $sshkey root@164.92.218.220 "sudo systemctl restart nodeapp"
                //   '''
              }
          }
      }
    }
}
