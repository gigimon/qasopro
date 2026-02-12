---

title: "Pytest - Fixtures"
date: 2026-02-12
category: "interesting"
dateLabel: "February 12, 2026"
lead: "pytest fixtures - basic usage"
image: "/images/blog/pytest-fixtures.png"

---

In the previous article, I briefly touched on the topic of pytest fixtures. In this one, I would like to expand a bit on what they are and why you should use them.

In traditional testing frameworks (for example unittest, JUnit, chai/mocha), to execute something before a test/tests, a function with names like `setup` or `before` is typically used.
Pytest provides a similar approach, but fixtures are more powerful and flexible.

*A fixture is a method or function wrapped in the `pytest.fixture` decorator that can be executed either automatically (always) or on demand, only when explicitly passed to a test function.*

Let’s look at the simplest example from the documentation — calling a fixture only when it is required:

```python
import pytest

@pytest.fixture
def alert():
    print("Execute fixture before test")
    yield
    print("Execute fixture after test")


def test1(alert):
    print("test1")

def test2():
    print("test2")
```

When executing this code, we will see the following output in the console once:

```
Execute fixture before test
test1
Execute fixture after test
test2
```

This happens because pytest detects that the test function explicitly defines the fixture (by function name) in its parameters and automatically injects it after executing the fixture. If there is no test function that receives the fixture, then the fixture will not be executed at all (this behavior can be changed). This way of calling fixtures works both with standalone functions and with class methods.

Any fixture can execute code both before and after a test function.
The code placed before `yield` runs BEFORE the test function (setup), and the code after `yield` runs after the test function (teardown). By default, such a fixture is executed anew for every test, but this behavior can be modified.

## Getting data from a fixture

Fixtures can return values to test functions, and these values can be dynamic. Let’s consider a simple example:

```python
import os
import pytest

@pytest.fixture
def is_linux():
    yield os.name == "posix"

def test1(is_linux):
    if is_linux:
        do_linux_dps()
    else:
        do_another()
```

A fixture can pass anything to a test function, just like a regular Python function.

## Fixture parameters

The first parameter is **autouse** — it indicates that the fixture should be executed regardless of whether it is explicitly passed to any test or not, and it will run before every test. This is useful, for example, when you need to prepare the environment, test data, or perform some action that affects every test, even if the fixture’s return value is not needed.

The next parameter is **scope** — this defines when the fixture will be recreated (re-executed). It can take several values:

* function — the default value, meaning the fixture is executed for each test function
* class — used with test classes and executed once before the test class is created and after all tests in the class have finished
* module — executed once when the module is loaded and after all tests in that module have finished
* package — the same, but within the package scope
* session — the fixture is executed once for the entire test session, before the first test runs and after the last test completes

Let’s look at an example with **module** scope:

```python
import time
import pytest

@pytest.fixture(scope="module")
def fixture_one():
    t = time.time()
    print(f"Execute fixture at: {t}")
    yield time.time()
    print(f"After fixture at: {t}")


def test1(fixture_one):
    print(f"Test 1 time {time.time()} fixture: {fixture_one}")
    time.sleep(1)


def test2(fixture_one):
    print(f"Test 2 time {time.time()} fixture: {fixture_one}")
```

When running this, we will see:

```
test_one.py::test1 Execute fixture at: 1770932204.870798
Test 1 time 1770932204.870919 fixture: 1770932204.870804
test_one.py::test2 Test 2 time 1770932205.8783429 fixture: 1770932204.870804
After fixture at: 1770932204.870798
```

Here we can verify that the value returned by the fixture is the same between tests, while the actual time changes. Also, the fixture was clearly executed only once.

## Calling fixtures

Any test can receive any number of fixtures. Additionally, fixtures themselves can accept other fixtures as input — you just need to pay attention to the fixture scope (we will talk about this in the next article).

A very common example of using a fixture inside another fixture is retrieving command-line arguments.

```python
import pytest


@pytest.fixture()
def cmdopt(request):
    return request.config.getoption("--our-option")


def test1(cmdopt):
    print(cmdopt)
```

The `cmdopt` fixture receives the `request` fixture, which is a built-in pytest fixture containing a lot of service information about the test, environment, and more.

I think this is a good place to conclude this introduction to fixtures, and we will discuss them in more detail in the next articles.
