---
title: "Pytest - как передавать фикстуры"
date: 2026-02-16
category: "интересности"
dateLabel: "16 февраля 2026"
lead: "pytest фикстуры - способы передачи их в тесты"
image: "/images/blog/pytest-fixtures2.png"
---

В прошлой статье я немного рассказал про фикстуры в pytest, что это такое и как их использовать.
Но когда начинаешь их часто использовать и на большом количестве тестов, начинаешь думать, как эффективнее их использовать или сменьшим количеством кода.

Давайт рассмотрим, как можно при классовой структуре тестов, работать с фикстурами

## Как в документации

Например, согласно документации рекомендуется делать вот так:

```python
import pytest

@pytest.fixture
def method_fixture():
    print("method fixture")


@pytest.fixture(scope="class")
def class_fixture():
    print("class fixture")


@pytest.fixture(scope="session")
def session_fixture():
    print("session fixture")


class TestClass:
    def test_1(self, method_fixture, session_fixture):
        pass

    def test_2(self, method_fixture, session_fixture, class_fixture):
        pass
    
    def test_3(self, method_fixture, class_fixture):
        pass

    def test_4(self, class_fixture, session_fixture):
        pass

    def test_5(self, method_fixture, session_fixture):
        pass
```

Плюсы такого подхода:
- все согласно документации
- полная ясность для любого человека, кто прочитал документацию по pytest

Минусы:
- постоянное перечисление одного и того же
- при большом количестве испольуземых фикстур, будет много параметров (линтеры могут возмущаться)
- в различные функции внутри класса придется передавать все фикстуры явно


## Использование метода, как фикстуру

Можно сделать метод, как функцию, у него будет доступ к self, куда можно прилинковать все наши фикстуры:

```python
class TestClassSelfFixtures:
    @pytest.fixture(autouse=True)
    def save_fixture(self, method_fixture, session_fixture, class_fixture):
        self.method_fixture = method_fixture
        self.session_fixture = session_fixture
        self.class_fixture = class_fixture

    def test_6(self):
        self.method_fixture()

    def test_7(self):
        self.class_fixture()
```

Плюсы:
- понятно с точки зрения ООП
- одно место добавления фикстур

Минусы:
- добавляется еще одна фикстура
- фикстура будет запускаться на каждую функцию и заново линковать (крошечный, но оверхед)
- добавленеи новых аттрибутов вне __init__ будет возмущать линтеры
- все минусы ООП при наследовании

## Использование request

Py.test имеет фикстуру request, которая несет в себе некоторые объекты окружения, текущий тест и класс и это можно использовать.

```python
@pytest.fixture(scope="class")
def attach_to_class(request):
    request.cls.class_fixture = class_fixture


@pytest.mark.usefixtures("attach_to_class")
class TestClassRequest:
    def test_8(self):
        print(self.class_fixture)
```

Здесь у фикстуры request имеется аттрибут cls, который является объектом нашего тестового класса и мы к нему добавляем аттрибут нашей фикстуры. А с помощью @pytest.mark.usefixtures - мы явно указываем список фикстур, которые нам нужны

Плюсы:
- вызывается один раз на класс
- вполне pytest way
- чистый код
- линтеры не ругаются (особенно если указать аттрибут на уровне класса)

Минусы:
- чуть сложнее логика, из-за чего требуется быть внимательнее
- логика спрятана в фикстуру, а не класс

## Какой способ использую я

В своей тестовой базе, со временем, мы пришли к последнему способу, но используем его только для class или более высокого уровня фикстур, для scope="function", мы явно передаем в каждый тест фикстуру.