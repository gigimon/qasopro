---

title: "Pytest - How to Pass Fixtures"
date: 2026-02-16
category: "interesting"
dateLabel: "February 16, 2026"
lead: "pytest fixtures - ways to pass them into tests"
image: "/images/blog/pytest-fixtures2.png"

---

In the previous article, I briefly talked about fixtures in pytest — what they are and how to use them.
However, when you start using them frequently and across a large number of tests, you begin to think about how to use them more efficiently or with less boilerplate code.

Let’s look at how you can work with fixtures when using a class-based test structure.

## As in the documentation

For example, according to the documentation, it is recommended to do something like this:

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

Pros of this approach:

* fully aligned with the documentation
* completely clear to anyone who has read the pytest documentation

Cons:

* repeatedly listing the same fixtures
* with a large number of fixtures, there will be many parameters (linters may complain)
* you must explicitly pass all fixtures into various functions inside the class

## Using a method as a fixture

You can define a method as a fixture; it will have access to `self`, where you can attach all your fixtures:

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

Pros:

* makes sense from an OOP perspective
* a single place to add fixtures

Cons:

* introduces one more fixture
* the fixture will run for every test function and reattach attributes each time (a tiny overhead, but still)
* adding new attributes outside `__init__` may cause linters to complain
* all the usual OOP inheritance downsides apply

## Using `request`

Pytest provides the `request` fixture, which contains environment objects, the current test, and the current class — and this can be leveraged.

```python
@pytest.fixture(scope="class")
def attach_to_class(request):
    request.cls.class_fixture = class_fixture


@pytest.mark.usefixtures("attach_to_class")
class TestClassRequest:
    def test_8(self):
        print(self.class_fixture)
```

Here, the `request` fixture has a `cls` attribute, which represents our test class object, and we attach our fixture as an attribute to it. With `@pytest.mark.usefixtures`, we explicitly specify the list of fixtures we need.

Pros:

* executed once per class
* follows the pytest philosophy
* clean code
* linters do not complain (especially if you declare the attribute at the class level)

Cons:

* slightly more complex logic, so you need to be more careful
* the logic is hidden inside the fixture rather than in the class itself

## Which approach I use

In our test codebase, over time, we settled on the last approach, but we use it only for class-level or higher-scope fixtures. For `scope="function"`, we explicitly pass the fixture into each test.
