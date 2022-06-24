pipeline {
    agent any

    stages {
        stage("run backend") {
            steps {
                echo 'executing yarn...'
                nodejs('Node-18.4.0') {
                    sh 'yarn install'
                }
            }
        }
    } 
}
