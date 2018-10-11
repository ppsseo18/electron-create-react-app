# electron-create-react-app
create-react-app 기반의 electron boilerplate
https://github.com/iffy/electron-updater-example


## Auto update

**NOTE:** Release서버가 GitHub가 아니면 다음 글을 참고한다.

- [Complete electron-updater HTTP example](https://gist.github.com/iffy/0ff845e8e3f59dbe7eaf2bf24443f104)
- [Complete electron-updater from gitlab.com private repo example](https://gist.github.com/Slauta/5b2bcf9fa1f6f6a9443aa6b447bcae05)


#### 1. macOS의 경우 code-signing certificate가 필요하며 없을경우 업데이트 가능 여부만 확인하며 업데이트 하지 않으므로 다음을 참고하여 설정한다.

Install Xcode (from the App Store), then follow [these instructions](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingCertificates/MaintainingCertificates.html#//apple_ref/doc/uid/TP40012582-CH31-SW6) to make sure you have a "Mac Developer" certificate.  If you'd like to export the certificate (for automated building, for instance) [you can](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingCertificates/MaintainingCertificates.html#//apple_ref/doc/uid/TP40012582-CH31-SW7).  You would then follow [these instructions](https://www.electron.build/code-signing).

#### 2. 프로젝트를 클론한 후 `package.json` 파일을 필요에 따라 수정한다.(버전, 작성자 등) 

디폴트로, `electron-updater`는 프로젝트의 .git/config에 설정된 GitHub설정을 읽어 기본 설정으로 만들어 준다. 직접 설정하고 싶다면 `publish`(https://github.com/electron-userland/electron-builder/wiki/Publishing-Artifacts#PublishConfiguration)항목을 다음과 같이 설정한다.
    
        {
            ...
            "build": {
                "publish": [{
                    "provider": "github",
                    "owner": "iffy",
                    "repo": "electron-updater-example"
                }],
                ...
            }
        }

#### 3. node.js 패키지들을 설치한다.

        yarn

   or

        npm install

#### 4. 다음 경로에서 GitHub 접근 토큰을 발급 받는다.<https://github.com/settings/tokens/new>  토큰은 반드시 `repo` 범위의 권한을 포함해야 한다. 토큰 발급 후 다음과 같이 환경 변수에 토큰값을 설정해준다.

On macOS/linux:

    export GH_TOKEN="<YOUR_TOKEN_HERE>"

On Windows, run in powershell:

    [Environment]::SetEnvironmentVariable("GH_TOKEN","<YOUR_TOKEN_HERE>","User")

설정 후 IDE/Terminal에도 적용되도록 재시작 한다.
    
#### 5. 배포할 버전에 대한 commit을 origin에 push한다. 이후 tag를 설정하여 다시 origin에 push한다. tag의 경우 `package.json`의 버전이 `0.0.1`일 경우 `v0.0.1`로 설정한다.

#### 6. 해당 OS 플랫폼에서 다음 명령어를 통해 publish한다

    build -p always
    
or

    npm run publish
    

더 많은 OS 플랫폼 버전을 publish하고 싶다면 다음처럼 `package.json`의 `publish` 스크립트를 수정한다.  

    ...
    "scripts": {
        "publish": "build --mac --win -p always"
    },
    ...

#### 7. <https://github.com/your-repo/electron-updater-example/releases>에서 해당 Release의 edit버튼을 눌러 수정 페이지에 접근한 후 "Publish release." 버튼을 통해 최종 publish를 한다.

#### 8. <https://github.com/iffy/electron-updater-example/releases>에서 앱을 다운받는다.

#### 9. `package.json`의 버전을 수정하고 5,6,7과정을 다시 반복한다.

#### 10. 앱을 실행하면 자동으로 업데이트가 진행될 것이다.
