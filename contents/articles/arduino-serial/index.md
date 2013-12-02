---
template: article.html
title:  "Arduino Serial Port Trick"
date:   2013-05-20 14:42:00
tags: [quickie,Arduino,C++]
---

Recently, I was making code on an Arduino Uno, that also needed to run on a Mega 2560. The Mega has 4 Harware serial ports, and the Uno has one.  I wanted it to auto-create Serial1, if needed, so I don't have to change my code.

---

Having a look at HardwareSerial.h, I saw this:

```c++
#if defined(UBRRH) || defined(UBRR0H)
  extern HardwareSerial Serial;
#elif defined(USBCON)
  #include "USBAPI.h"
//  extern HardwareSerial Serial_;  
#endif
#if defined(UBRR1H)
  extern HardwareSerial Serial1;
#endif
#if defined(UBRR2H)
  extern HardwareSerial Serial2;
#endif
#if defined(UBRR3H)
  extern HardwareSerial Serial3;
#endif
```

So, at the top of my sketch, I put this:

```c++
#ifndef UBRR1H
#include <SoftwareSerial.h>
SoftwareSerial Serial1(10, 11); // RX, TX
#endif
```

Which will load a SoftwareSerial (on pins 10 & 11) at Serial1 (which is the same as the name on the Mega.)

Now, I can do this:

```c++
#ifndef UBRR1H
#include <SoftwareSerial.h>
SoftwareSerial Serial1(10, 11); // RX, TX
#endif

void setup()  
{
  Serial.begin(19200);
  Serial1.begin(19200);
}

void loop()
{
  if (Serial1.available()) {
      Serial.write((char)Serial1.read());
  }
  if (Serial.available()) {
      Serial1.write((char)Serial.read());
  }
}
```