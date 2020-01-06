#include "stdio.h"
#include "stdlib.h"
#include "errno.h"
#include "string.h"
#include "netdb.h"
#include "sys/types.h"
#include "netinet/in.h"
#include "sys/socket.h"
#include "arpa/inet.h"
#include "unistd.h"

void   readFile (FILE *fd  , char *buf , int size){
    fread(buf , size , 1 , fd);
} 

int main(int argc,char *argv[])
{
    FILE *fd;
    long int head  = 0;
    int sockfd,numbytes;
    char buf[BUFSIZ];
    int  size = 0;
    short int  ok = 1;
    struct sockaddr_in their_addr;
    printf("break!");
    while((sockfd = socket(AF_INET,SOCK_STREAM,0)) == -1);
    printf("We get the sockfd~\n");
    their_addr.sin_family = AF_INET;
    their_addr.sin_port = htons(8080);
    their_addr.sin_addr.s_addr=inet_addr("192.168.43.149");
    bzero(&(their_addr.sin_zero), 8);
    
    while(connect(sockfd,(struct sockaddr*)&their_addr,sizeof(struct sockaddr)) == -1);
    printf("Get the Server~Cheers!\n");
    numbytes = recv(sockfd, buf, BUFSIZ,0);//接收服务器端信息  
    buf[numbytes]='\0';  
    printf("%s", buf);
    // while(1)
    // {
    //     printf("Enter something:");
    //     scanf("%s",buf);
    //     numbytes = send(sockfd, buf, strlen(buf), 0);
    //     numbytes=recv(sockfd,buf,BUFSIZ,0);  
    //     buf[numbytes]='\0'; 
    //     printf("received:%s\n",buf);  

    // }
fd = fopen("../origin.bmp" , "rb" );
if(fd == NULL){
    printf("文件读取失败");
}else{
    fseek(fd ,  0L , SEEK_END);
    int length = ftell(fd);
    printf("length:%d\n" , length);
    fseek(fd , 0L, SEEK_SET);
     /*  if(length > BUFSIZ){
           size = BUFSIZ;
           head += BUFSIZ;
           length -= BUFSIZ;
       }else
       {
           size = length;
           ok = 0;
       };*/
int time=length/8192;
int lastByte = length%8192;
   while (time>0) {  
     readFile( fd ,buf , BUFSIZ);
      numbytes = send(sockfd , buf , BUFSIZ, 0);
      time--;
  }
  readFile(fd,buf,BUFSIZ);
  send(sockfd,buf,lastByte,0);

    numbytes = recv(sockfd , buf , BUFSIZ , 0);
    buf[numbytes] = '\0';
    printf("received:%s\n" , buf );
}

//
    close(sockfd);
    return 0;
}

