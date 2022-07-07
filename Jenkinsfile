pipeline {
    agent any

      stages {
          stage('build') {
              steps {
                  echo 'building the software'
                //   sh 'npm install'
              }
          }
          stage('test') {
              steps {
                  echo 'testing the software'
                 
              }
          }

          stage('deploy') {
              steps {
                     withCredentials([sshUserPrivateKey(credentialsId: "jenkins-ssh", keyFileVariable: 'sshkey')]){
                  echo 'deploying the software'
                  sh '''#!/bin/bash
                  echo "Creating .ssh"
                  mkdir -p /var/lib/jenkins/.ssh
                  sudo -i
                  ssh-keyscan 192.168.56.11 >> /var/lib/jenkins/.ssh/known_hosts
                   sudo -i
                  ssh-keyscan 192.168.56.12 >> /var/lib/jenkins/.ssh/known_hosts
                  
                 
                 sudo rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./ vagrant@192.168.56.11:/app/
                 
                 sudo rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./ vagrant@192.168.56.12:/app/

                  ssh -i $sshkey vagrant@192.168.56.11 "cd /app/user-auth-with-nodejs"
                 ssh -i  $sshkey vagrant@192.168.56.11 "pm2 start app.js"
                 ssh -i  $sshkey vagrant@192.168.56.12 "cd /app/user-auth-with-nodejs"
                 ssh -i  $sshkey vagrant@192.168.56.12 "pm2 start app.js"

                  '''
              }
          }
      }
    }
}



