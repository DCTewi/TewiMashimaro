#!/bin/bash

exists()
{
  command -v "$1" >/dev/null 2>&1
}

logo()
{
    echo "  _____              _                  _     _                           "
    echo " /__   \_____      _(_) /\/\   __ _ ___| |__ (_)_ __ ___   __ _ _ __ ___  "
    echo "   / /\/ _ \ \ /\ / / |/    \ / _\` / __| '_ \| | '_ \` _ \ / _\` | '__/ _ \ "
    echo "  / / |  __/\ V  V /| / /\/\ \ (_| \__ \ | | | | | | | | | (_| | | | (_) |"
    echo "  \/   \___| \_/\_/ |_\/    \/\__,_|___/_| |_|_|_| |_| |_|\__,_|_|  \___/ "
}

clear
logo

echo '------------------'
echo '| CONFIGURATIONS |'
echo '------------------'

while :
do
    read -p 'Please input the domain of your mashimaro:' DOMAIN
    if [[ $DOMAIN =~ ^([a-zA-Z0-9][-a-zA-Z0-9]{0,62}\.)+[-a-zA-Z0-9]{2,6}$ ]]; then
        break
    else
        echo Invalid domain! example: your.domain.com
    fi
done

echo '--------------------'
echo '| CREATE WORKSPACE |'
echo '--------------------'

sudo mkdir /home/mashimaro -p
cd /home/mashimaro

echo '------------------------'
echo '| NODE.JS INSTALLATION |'
echo '------------------------'

if ! exists node; then
    curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo '--------------------------'
echo '| MASHIMARO INSTALLATION |'
echo '--------------------------'

sudo npm install @dctewi/tewi-mashimaro -g

sudo wget https://raw.githubusercontent.com/DCTewi/TewiMashimaro/main/tools/mashimaro.service
sudo sed -i "s/__USER_DOMAIN__/$DOMAIN/g" mashimaro.service

sudo mv mashimaro.service /etc/systemd/system/mashimaro.service
sudo systemctl daemon-reload
sudo systemctl enable mashimaro.service

echo '------------------------'
echo '| CERTBOT INSTALLATION |'
echo '------------------------'

if ! exists snap; then
    sudo apt install snapd -y
fi

sudo snap install core; sudo snap refresh core

if exists certbot; then
    sudo apt remove certbot -y
fi

sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

echo '------------------'
echo '| SSL GENERATION |'
echo '------------------'

sudo certbot certonly --standalone --noninteractive --agree-tos -m john@doe.com -d $DOMAIN

sudo sh -c 'printf "#!/bin/bash\n systemctl stop mashimaro\n" > /etc/letsencrypt/renewal-hooks/pre/mashimaro.sh'
sudo sh -c 'printf "#!/bin/bash\n systemctl start mashimaro\n" > /etc/letsencrypt/renewal-hooks/post/mashimaro.sh'

sudo chmod 755 /etc/letsencrypt/renewal-hooks/pre/mashimaro.sh
sudo chmod 755 /etc/letsencrypt/renewal-hooks/post/mashimaro.sh

echo '--------------------'
echo '| STARTING SERVICE |'
echo '--------------------'

## final start
sudo systemctl start mashimaro.service

echo '--------------------'
echo '| INSTALL FINISHED |'
echo '--------------------'

logo

echo Try to access your mashimaro on $DOMAIN !
