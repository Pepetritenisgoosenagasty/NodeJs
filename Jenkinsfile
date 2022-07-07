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
             
          stage('deploy') {
              steps {
                withCredentials([sshUserPrivateKey(credentialsId: "jenkins-ssh", keyFileVariable: 'sshkey')]){
                  echo 'deploying the software'
                  sh '''#!/bin/bash
                  echo "Creating .ssh"
                  mkdir -p /var/lib/jenkins/.ssh
                  ssh-keyscan 192.168.56.11 >> /var/lib/jenkins/.ssh/known_hosts
                  ssh-keyscan 192.168.56.12 >> /var/lib/jenkins/.ssh/known_hosts

                  rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./ vagrant@192.168.56.11:/app/
                  rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./ vagrant@192.168.56.12:/app/

                  ssh -i $sshkey vagrant@192.168.56.11 "cd /app/user-auth-with-nodejs"
                  ssh -i $sshkey vagrant@192.168.56.11 "pm2 start app.js"
                  ssh -i $sshkey vagrant@192.168.56.12 "cd /app/user-auth-with-nodejs"
                  ssh -i $sshkey vagrant@192.168.56.12 "pm2 start app.js"

                  '''
              }
          }
      }
    }
}
