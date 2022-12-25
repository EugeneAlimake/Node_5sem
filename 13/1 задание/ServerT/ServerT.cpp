#define _CRT_SECURE_NO_WARNINGS
#define _WINSOCK_DEPRECATED_NO_WARNINGS

#include <iostream>
#include "Winsock2.h"               // заголовок WS2_32.dll
#pragma comment(lib, "WS2_32.lib")  // экспорт WS2_32.dll

using namespace std;

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
    SOCKET sS;
    WSADATA wsadata;

    try
    {
        if (WSAStartup(MAKEWORD(2, 0), &wsadata) != 0)
            throw SetErrorMsgText("Startup: ", WSAGetLastError());

        if ((sS = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
            throw SetErrorMsgText("Socket", WSAGetLastError());

        SOCKADDR_IN serv;// параметры  сокета serv
        serv.sin_family = AF_INET;// используется IP-адресация  
        serv.sin_port = htons(2000);// порт 2000
        serv.sin_addr.S_un.S_addr = INADDR_ANY;// любой собственный IP-адрес 

        if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)//Функция bind связывает сокет с параметрами, заданными в структуре SOCKADDR_IN.  
            throw SetErrorMsgText("Bind: ", WSAGetLastError());

        while (true)
        {
            SOCKET cS; //дескриптор сокета
            SOCKADDR_IN clnt;
            memset(&clnt, 0, sizeof(clnt));
            int lclnt = sizeof(clnt);

            if (listen(sS, SOMAXCONN) == SOCKET_ERROR)//Чтобы сделать доступным уже   связанный сокет, необходимо его переключить,  в так называемый,  прослушивающий режим
                throw SetErrorMsgText("Listen: ", WSAGetLastError());
            cout << endl << "Listening...\n" << endl;

            if ((cS = accept(sS, (sockaddr*)&clnt, &lclnt)) == INVALID_SOCKET)//Функция accept (описание на рисунке 3.10.1)  приостанавливает выполнение программы сервера  до момента  срабатывания в   программе клиента функции connect 
                throw  SetErrorMsgText("Accept: ", WSAGetLastError());

            cout << "Connection params:\n IP:\t" << inet_ntoa(clnt.sin_addr) << "\n PORT:\t" << ntohs(clnt.sin_port);

            char input_buf[50];
            int  libuf = 0, lobuf = 0;

            do
            {
                if ((libuf = recv(cS, input_buf, sizeof(input_buf), NULL)) == SOCKET_ERROR)
                    throw  SetErrorMsgText("Recv: ", WSAGetLastError());

                cout << endl << "\n MESSAGE:\t" << input_buf << endl;

                if ((lobuf = send(cS, input_buf, strlen(input_buf) + 1, NULL)) == SOCKET_ERROR)
                    throw  SetErrorMsgText("Send: ", WSAGetLastError());

            } while (input_buf[0] != '\0');

            if (closesocket(cS) == SOCKET_ERROR)
                throw SetErrorMsgText("CloseSocket: ", WSAGetLastError());
        }

       

        if (closesocket(sS) == SOCKET_ERROR)
            throw SetErrorMsgText("CloseSocket: ", WSAGetLastError());

        if (WSACleanup() == SOCKET_ERROR)
            throw SetErrorMsgText("Cleanup: ", WSAGetLastError());
    }
    catch (string errorMsgText)
    {
        cout << endl << errorMsgText;
    }
    return 0;
}

