ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key -N ""
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub

echo "\n\n\n"
echo "JWT_PRIVATE_KEY=$(base64 -i jwtRS256.key)"
echo "JWT_PUBLIC_KEY=$(base64 -i jwtRS256.key.pub)"

rm jwtRS256.key
rm jwtRS256.key.pub