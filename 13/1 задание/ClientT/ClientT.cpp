#define _WINSOCK_DEPRECATED_NO_WARNINGS
#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include "Winsock2.h"
#include <chrono>

#pragma comment(lib, "WS2_32.lib")


using namespace std;
using namespace std::chrono;

string GetErrorMsgText(int code)
{
    string msgText;
    switch (code)
    {
    case WSAEINTR: msgText = "Работа функции прервана"; break;
    case WSAEACCES: msgText = "Разрешение отвергнуто"; break;
    case WSAEFAULT: msgText = "Ошибочный адрес"; break;
    case WSAEINVAL: msgText = "Ошибка в аргументе"; break;
    case WSAEMFILE: msgText = "Слишком много файлов открыто"; break;
    case WSAEWOULDBLOCK:msgText = "Ресурс временно недоступен"; break;
    case WSAEINPROGRESS:msgText = "Операция в процессе развития"; break;
    case WSAEALREADY:msgText = "Операция уже выполняется "; break;
    case WSAENOTSOCK:msgText = "Сокет задан неправильно"; break;
    case WSAEDESTADDRREQ:msgText = "Требуется адрес расположения "; break;
    case WSAEMSGSIZE:msgText = "Сообщение слишком длинное "; break;
    case WSAEPROTOTYPE:msgText = "Неправильный тип протокола для сокета "; break;
    case WSAENOPROTOOPT:msgText = "Ошибка в опции протокола"; break;
    case WSAEPROTONOSUPPORT:msgText = "Протокол не поддерживается "; break;
    case WSAESOCKTNOSUPPORT:msgText = "Тип сокета не поддерживается "; break;
    case WSAEOPNOTSUPP:msgText = "Операция не поддерживается "; break;
    case WSAEPFNOSUPPORT:msgText = "Тип протоколов не поддерживается "; break;
    case WSAEAFNOSUPPORT:msgText = "Тип адресов не поддерживается протоколом"; break;
    case WSAEADDRINUSE:msgText = "Адрес уже используется "; break;
    case WSAEADDRNOTAVAIL:msgText = "Запрошенный адрес не может быть использован"; break;
    case WSAENETDOWN:msgText = "Сеть отключена "; break;
    case WSAENETUNREACH:msgText = "Сеть не достижима"; break;
    case WSAENETRESET:msgText = "Сеть разорвала соединение"; break;
    case WSAECONNABORTED:msgText = "Программный отказ связи "; break;
    case WSAECONNRESET:msgText = "Связь восстановлена "; break;
    case WSAENOBUFS:msgText = "Не хватает памяти для буферов"; break;
    case WSAEISCONN:msgText = "Сокет уже подключен"; break;
    case WSAENOTCONN:msgText = "Сокет не подключен"; break;
    case WSAESHUTDOWN:msgText = "Нельзя выполнить send: сокет завершил работу"; break;
    case WSAETIMEDOUT:msgText = "Закончился отведенный интервал  времени"; break;
    case WSAECONNREFUSED:msgText = "Соединение отклонено  "; break;
    case WSAEHOSTDOWN:msgText = "Хост в неработоспособном состоянии"; break;
    case WSAEHOSTUNREACH:msgText = "Нет маршрута для хоста "; break;
    case WSAEPROCLIM:msgText = "Слишком много процессов "; break;
    case WSASYSNOTREADY:msgText = "Сеть не доступна "; break;
    case WSAVERNOTSUPPORTED:msgText = "Данная версия недоступна "; break;
    case WSANOTINITIALISED:msgText = "Не выполнена инициализация WS2_32.DLL"; break;
    case WSAEDISCON:msgText = "Выполняется отключение"; break;
    case WSATYPE_NOT_FOUND:msgText = "Класс не найден "; break;
    case WSAHOST_NOT_FOUND:msgText = "Хост не найден"; break;
    case WSATRY_AGAIN:msgText = "Неавторизированный хост не найден "; break;
    case WSANO_RECOVERY:msgText = "Неопределенная  ошибка "; break;
    case WSANO_DATA:msgText = "Нет записи запрошенного типа "; break;
    case WSA_INVALID_HANDLE:msgText = "Указанный дескриптор события  с ошибкой"; break;
    case WSA_INVALID_PARAMETER:msgText = "Один или более параметров с ошибкой"; break;
    case WSA_IO_INCOMPLETE:msgText = "Объект ввода-вывода не в сигнальном состоянии"; break;
    case WSA_IO_PENDING:msgText = "Операция завершится позже  "; break;
    case WSA_NOT_ENOUGH_MEMORY:msgText = "Не достаточно памяти "; break;
    case WSA_OPERATION_ABORTED:msgText = "Операция отвергнута "; break;
    case WSAEINVALIDPROCTABLE:msgText = "Ошибочный сервис "; break;
    case WSAEINVALIDPROVIDER:msgText = "Ошибка в версии сервиса "; break;
    case WSAEPROVIDERFAILEDINIT:msgText = "Невозможно инициализировать сервис "; break;
    case WSASYSCALLFAILURE:msgText = "Аварийное завершение системного вызова "; break;
    default: msgText = "***ERROR***"; break;
    }
    return msgText;
}

string SetErrorMsgText(string msgText, int code)
{
    return msgText + GetErrorMsgText(code);
}

int main()
{
    SOCKET sS;// серверный сокет
    WSADATA wsadata;
    try
    {
        
        if (WSAStartup(MAKEWORD(2, 0), &wsadata) != 0)//WSAStartup Инициализировать библиотеку WS2_32.DLL
            throw SetErrorMsgText("Startup: ", WSAGetLastError());//WSAGetLastError-Получить диагностирующий код ошибки 

        
        if ((sS = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)//socket-создать сокет
            throw SetErrorMsgText("Socket: ", WSAGetLastError());//WSAGetLastError-Получить диагностирующий код ошибки 

        SOCKADDR_IN serv;// параметры  сокета sS
        serv.sin_family = AF_INET;// используется IP-адресация  
        serv.sin_port = htons(2000);// порт 
        serv.sin_addr.s_addr = inet_addr("127.0.0.1");//Преобразовать символьное представление  IPv4-адреса  в формат TCP/IP

        if ((connect(sS, (sockaddr*)&serv, sizeof(serv))) == SOCKET_ERROR)//connect -Установить соединение с сокетом
            throw  SetErrorMsgText("Connect: ", WSAGetLastError());//WSAGetLastError-Получить диагностирующий код ошибки 




        char input_buf[50], output_buf[50];
        int  libuf = 0, lobuf = 0;

        int a;
        cout << "Type number of massages: ";
        cin >> a;

        char numbBuf[4];

        high_resolution_clock::time_point t1 = high_resolution_clock::now();

        for (int i = 1; i <= a; i++)
        {
            _itoa(i, numbBuf, 10);
            strcpy_s(output_buf, "Hello from client \0");
            strcat_s(output_buf, numbBuf);

            if ((lobuf = send(sS, output_buf, strlen(output_buf) + 1, NULL)) == SOCKET_ERROR)//send-Отправить данные по установленному каналу 
                throw  SetErrorMsgText("Send: ", WSAGetLastError());//WSAGetLastError-Получить диагностирующий код ошибки 


            if ((lobuf = recv(sS, input_buf, sizeof(input_buf), NULL)) == SOCKET_ERROR)//recv-Принять данные по установленному каналу
                throw  SetErrorMsgText("Recv: ", WSAGetLastError());//WSAGetLastError-Получить диагностирующий код ошибки 

            cout << endl << input_buf << endl;
        }

        high_resolution_clock::time_point t2 = high_resolution_clock::now();

        duration<double> time_span = duration_cast<duration<double>>(t2 - t1);
        cout << "Time passed: " << time_span.count() << " seconds." << endl << endl;

        system("PAUSE");

        strcpy_s(output_buf, "\0");

        if ((lobuf = send(sS, output_buf, strlen(output_buf) + 1, NULL)) == SOCKET_ERROR)//send-Отправить данные по установленному каналу 
            throw  SetErrorMsgText("send:", WSAGetLastError());//WSAGetLastError-Получить диагностирующий код ошибки

        if (closesocket(sS) == SOCKET_ERROR)//closesocket-Закрыть существующий сокет 
            throw SetErrorMsgText("CloseSocket: ", WSAGetLastError());//WSAGetLastError-Получить диагностирующий код ошибки 
        
        if (WSACleanup() == SOCKET_ERROR)//WSACleanup--Завершить использование библиотеки WS2_32.DLL 
            throw SetErrorMsgText("Cleanup: ", WSAGetLastError());//WSAGetLastError-Получить диагностирующий код ошибки 
    }
    catch (string errorMsgText)
    {
        cout << endl << errorMsgText;
    }
}