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

                 withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId:'github-credentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                    sh '''#!/bin/bash
                        echo "rsync the old apps folder"
                        echo "Creating .ssh"
                        mkdir -p /var/lib/jenkins/.ssh
                        echo "directory created"
                        ssh-keyscan 164.92.218.220 >> /var/lib/jenkins/.ssh/known_hosts
                        echo "Keyscan done successfully"
                        
                        rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./ root@164.92.218.220:/apps/
                         echo "app rsync done successfully"
                        '''
                 }
          }
      }
    }
}
