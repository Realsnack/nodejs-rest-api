node {
    stage('Clone repo') {
        git branch: 'main', credentialsId: 'realsnack-git', url: 'https://github.com/Realsnack/nodejs-rest-api.git'
    }
    
    stage('Build docker image') {
        sh 'docker build -t 192.168.1.27:49153:latest .'
    }

    stage('Push image') {
        sh 'docker push 192.168.1.27:49153/nodejs-restapi:latest'
    }

    stage('Remove old container') {
        sh 'docker stop nodejs-rest_api && docker rm nodejs-rest_api || true'
    }

    stage('Run docker image') {
        sh 'docker run -d --name nodejs-rest_api -p 3080:3080 192.168.1.27:49153/nodejs-restapi:latest'
    }
}