/*
  booksiveread — Arduino physical button counter
  
  Wiring:
    - Button (add)    → pin 2 + GND (uses internal pull-up)
    - Button (remove) → pin 3 + GND (uses internal pull-up)
    - Optional LED    → pin 13 (built-in, flashes on count)
  
  Count is stored in EEPROM so it survives power loss.
*/

#include <EEPROM.h>

const int BTN_ADD    = 2;
const int BTN_REMOVE = 3;
const int LED        = 13;
const int EEPROM_ADDR = 0;

int count = 0;

unsigned long lastAdd    = 0;
unsigned long lastRemove = 0;
const unsigned long DEBOUNCE = 200;

void flash(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED, HIGH); delay(80);
    digitalWrite(LED, LOW);  delay(80);
  }
}

void saveCount() {
  EEPROM.put(EEPROM_ADDR, count);
}

void setup() {
  pinMode(BTN_ADD,    INPUT_PULLUP);
  pinMode(BTN_REMOVE, INPUT_PULLUP);
  pinMode(LED, OUTPUT);

  EEPROM.get(EEPROM_ADDR, count);
  if (count < 0) count = 0;

  Serial.begin(9600);
  Serial.print("Books read: ");
  Serial.println(count);

  flash(2);
}

void loop() {
  unsigned long now = millis();

  if (digitalRead(BTN_ADD) == LOW && now - lastAdd > DEBOUNCE) {
    lastAdd = now;
    count++;
    saveCount();
    Serial.print("Added! Total: ");
    Serial.println(count);
    flash(1);
    delay(50);
  }

  if (digitalRead(BTN_REMOVE) == LOW && now - lastRemove > DEBOUNCE) {
    lastRemove = now;
    if (count > 0) {
      count--;
      saveCount();
      Serial.print("Removed. Total: ");
      Serial.println(count);
      flash(3);
    }
    delay(50);
  }
}
