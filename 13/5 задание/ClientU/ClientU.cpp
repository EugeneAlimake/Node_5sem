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
    default: msgText = "??? UNKKOWN ERROR ???"; break;
    }
    return msgText;
}

string SetErrorMsgText(string msgText, int code)
{
    return msgText + GetErrorMsgText(code);
}

int main()
{
    setlocale(LC_CTYPE, "rus");
    SOCKET cS;
    WSADATA wsadata;
    try
    {
        if (WSAStartup(MAKEWORD(2, 0), &wsadata) != 0)
            throw SetErrorMsgText("Startup: ", WSAGetLastError());
        
        if ((cS = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET)
            throw SetErrorMsgText("Socket: ", WSAGetLastError());

        SOCKADDR_IN serv;
        serv.sin_family = AF_INET;
        serv.sin_port = htons(3000);
        serv.sin_addr.s_addr = inet_addr("127.0.0.1");

        char obuf[50];
        char ibuf[50];
        int  lobuf;
        int  lb = 0;

        int countMessage = 0;
        std::cout << std::endl << "Введите количество сообщений: ";
        std::cin >> countMessage;
        char numbBuf[4];
        int lc = sizeof(serv);

        high_resolution_clock::time_point t1 = high_resolution_clock::now();
        for (int i = 0; i < countMessage; i++)
        {
            _itoa(i, numbBuf, 10);
            strcpy_s(obuf, "Hello from ClientU \0");
            strcat_s(obuf, numbBuf);

            if ((lobuf = sendto(cS, obuf, strlen(obuf) + 1, NULL, (sockaddr*)&serv, lc)) == SOCKET_ERROR)
                throw  SetErrorMsgText("Send: ", WSAGetLastError());
           Sleep(15);
            if ((lobuf = recvfrom(cS, ibuf, sizeof(ibuf), NULL, (sockaddr *)&serv, &lc)) == SOCKET_ERROR)
                throw  SetErrorMsgText("Recv: ", WSAGetLastError());

            cout << endl << ibuf << endl;
           
        }
        high_resolution_clock::time_point t2 = high_resolution_clock::now();

        duration<double> time_span = duration_cast<duration<double>>(t2 - t1);
        cout << "Time " << time_span.count() << " seconds." << std::endl << std::endl;

        strcpy_s(obuf, "\0");

        if ((lobuf = sendto(cS, obuf, strlen(obuf) + 1, NULL, (sockaddr*)&serv, lc)) == SOCKET_ERROR)
           throw  SetErrorMsgText("Send:", WSAGetLastError());

        system("PAUSE");

        if (closesocket(cS) == SOCKET_ERROR)
            throw SetErrorMsgText("CloseSocket: ", WSAGetLastError());
        
        if (WSACleanup() == SOCKET_ERROR)
            throw SetErrorMsgText("Cleanup: ", WSAGetLastError());
    }
    catch (string errorMsgText)
    {
        cout << endl << errorMsgText;
    }
}


