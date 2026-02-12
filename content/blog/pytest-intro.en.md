---
title: "Pytest - Intro"
date: 2026-02-06
category: "curiosities"
dateLabel: "January 6, 2026"
lead: "Pytest - intro in automatization"
image: "/images/blog/pytest-intro.jpg"
---

In the Python community, pytest is probably the most popular test “runner”, and there are several reasons for this:

* active development — pytest releases come out regularly, adding new features
* flexibility — it does not impose strict rules on you; you can choose the test architecture yourself. You can write any kind of tests, use BDD, etc.
* extensibility — a very flexible system of plugins, extensions, and so on
* a unique feature called “fixtures” — a way to inject dependencies into tests

In this article, I would like to briefly talk about all of these things.

## Active development

A very active GitHub project: bugfix releases are published every 2–4 weeks, and releases with new functionality every 6–9 months. An active community with a large number of pull requests and bug reports.

## Flexibility

Py.test does not impose any structure on your tests at all — how to organize them or how to write them. You can use pytest to run doctests (I wonder if anyone actually uses them?), write tests without classes, write tests with classes, connect and use BDD, write unit tests, UI tests — in short, there are no restrictions. You can store your files next to your tests, in a separate folder, with any hierarchy you like.

You can also write your own extensions that improve `assert` checks and provide custom output.

## Extensibility

In py.test, there are two extension mechanisms:

1. Custom fixtures — small functions that directly affect tests and the environment (for example, performing setup/teardown)
2. Plugins — a very flexible plugin system that allows you to influence almost any aspect of py.test’s behavior. You can hook into and affect: custom command-line flags, test discovery, test generation, test execution, assertion handling, exception processing, result reporting, and more. You can read more about this [here](https://docs.pytest.org/en/stable/how-to/writing_plugins.html)

## Fixtures

When people talk about py.test, fixtures are of course what comes to mind. This is pytest’s way of implementing setup and teardown logic (running something before and after tests), but with several special features:

1. you control when it should run — for every test, once per module, or once globally
2. a single function can cover both the “before” and “after” parts of a test
3. a fixture can return a value that will be passed into your test

Let’s look at an example of how this works. Suppose that before all tests we need to initialize a database, and before each test create a user in it, and after the test remove that user:

```python
import pytest
import sqlite3


@pytest.fixture(scope="session")
def init_db():
    db = sqlite3.connect("db.sqlite")
    yield db
    db.close()


@pytest.fixture()
def new_user(db):
    username = generate_username()
    cur = db.cursor()
    cur.execute("INSERT INTO ...")
    yield username
    cur.execute("DELETE FROM ...")


def test_user1(new_user):
    print(new_user)


def test_user2(new_user):
    print(new_user)

```

In this example, the `init_db` function will run only once: everything before `yield db` will be executed before all tests, and everything after `yield` will run after all tests have completed.

The `new_user` function, on the other hand, will be called only as many times as it is passed into a test function — in our case, twice. If we add another test but do not pass `new_user` to it, the fixture will not be executed a third time.

As you can see from the example, fixtures can be used inside other fixtures, not only in tests.

If you run this code (after, of course, making it actually work), you will see that in each test `new_user` will be different (both as an object and as a value).

I will talk about working with fixtures in more detail in the next article.
