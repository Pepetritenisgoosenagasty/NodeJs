pipeline {
    agent any

      stages {
          stage('build') {
              steps {
                  echo 'building the software'
                  sh 'npm install'
              }
          }
          stage('test') {
              steps {
                  echo 'testing the software'
                  sh 'npm test'
              }
          }

          stage('deploy') {
              steps {
                withCredentials([sshUserPrivateKey(credentialsId: "Jenkins-ssh", keyFileVariable: 'sshkey')]){
                  echo 'deploying the software'
                  sh '''#!/bin/bash
                  echo "Creating .ssh"
                  mkdir -p /var/lib/jenkins/.ssh
                  ssh-keyscan 192.168.56.12 >> /var/lib/jenkins/.ssh/known_hosts
                

                  rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./ vagrant@192.168.56.12:/app/
                 

                  ssh -i $sshkey vagrant@192.168.56.12 "sudo systemctl restart nodeapp"
                  '''
              }
          }
      }
    }
}
