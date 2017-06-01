---
title: Testing Angular
author: \@cvuorinen
patat:
    wrap: true
    columns: 60
...


# Testing Angular apps

&nbsp;

Testing strategies that will help
you write clean and readable tests

&nbsp;

&nbsp;

*Angular Finland June 2017 meetup*


by Carl Vuorinen

----

# Carl Vuorinen

*@cvuorinen*

```
     _       _    _________
    | |     | |  |______  |
    | | |\  | |     ____| |
    | | | | | |     \___  <
    | |_| |_| |   ______| |
    |____^____|  |________|

    ___ ___  ___  _   _ ___ 
   / __| _ \/ _ \| | | | _ \
  | (_ |   | (_) | |_| |  _/
   \___|_|_\\___/ \___/|_|  

```

----


# Why do you test?

----

# Tests are Documentation

&nbsp;

- Small examples of how the code should be used

----

# Refactoring

&nbsp;

- Tests give you *confidence*, so you don't have to worry about *regressions*

----

# Types of Tests

&nbsp;

* Unit tests

. . .

* Integration tests

. . .

* End-to-End tests

----

# Types of Tests

|                     | Unit | E2E  |
|---------------------|------|------|
| Fast                | *Yes*|__No__|
| Reliable            | *Yes*|__No__|
| Isolate             | *Yes*|__No__|
| Simulates real user |__No__| *Yes*|

----

# Testing Pyramid

&nbsp;

```
          /\
         /  \
        /e2e \
       / ---  \
      / integ- \
     / ration   \
    / ---------  \
   /    unit      \
  /________________\ 
```


----

# Tools for Testing Angular

## Angular CLI FTW!

- Unit & integration testing:
    - Testing framework: [Jasmine](./angular-excel/jasmine.ts)
    - Helpers: [Angular testing utilities](./angular-excel/src/app/app.component.spec.ts)
    - Test runner: [Karma](./angular-excel/karma.conf.js)

- E2E testing:
    - [Protractor](./angular-excel/protractor.conf.js)

----

# Anatomy of a Test

1. Setup

2. Execute

3. Verify

----

# Anatomy of a Test

1. Setup / Arrange

2. Execute / Act

3. Verify / Assert

----

# Anatomy of a Test

1. Setup / Arrange / Given

2. Execute / Act / When

3. Verify / Assert / Then

[./angular-excel/src/app/spreadsheet.service.ts]

----

# Test Doubles

- AKA Mocks, Spies, Stubs, Fakes, Dummies

. . .

- Stand-in for a real dependency
    - Allows full control of the test

[./angular-excel/src/app/cell/cell.component.ts]

----

# Async Testing

- Jasmine:
    - `done`

- Angular testing utils:
    - `async`
    - `fakeAsync` & `tick`

. . .

[./angular-excel/src/app/cell/cell.component.spec.ts:28]

----

# Fragile Tests

- Tests that break often

- Or break when functionality that they should be testing was not changed

. . .

- Reduces trust => discourages refactoring

----

# What makes tests Fragile?

- Data sensitivity

- Context sensitivity

- Mocking too "deep"

. . .

[./angular-excel/invoice.spec.js:230]

[./angular-excel/file-upload.spec.js:16]

----

# E2E Tests

- Second line of defense

. . .

[./angular-excel/e2e/app.e2e-spec.ts]

----

# Debugging Tests

- Jasmine:
    - `fit`, `fdescribe`

- Karma:
    - `debugger`

- Protractor:
    - `browser.pause()`

. . .

[./angular:28-excel/src/app/spreadsheet.service.spec.ts:45]

[./angular-excel/e2e/app.e2e-spec.ts:54]

----

# Test Economy

- Return on Investment (ROI)

- Focus on the parts that you worry about breaking the most

----

# Continuous Integration

- Tests are no good if they are not run

- Automate everything you can

- Make fixing failed build priority no. 1

. . .

[./angular-excel/karma.conf.js:44]

[./angular-excel/protractor.conf.js:14]

----

```
  _______ _                .       __                          ,__ 
 '   /    /        ___     /       |    ___  ,    .       __.  /  `
     |    |,---. .'   `    |       |   /   ` |    `     .'   \ |__ 
     |    |'   ` |----'    |  /\   /  |    | |    |     |    | |   
     /    /    | `.___,    |,'  \,'   `.__/|  `---|.     `._.' |   
                                              \___/            /   

         #
 ########                      ##        ##                             
#  ##                         ##                                        
   ##       ####     ##### #######    ####   ###  ###  ##   ##    ##### 
  ##      ##   ##   ##       ##         ##    ##  ##   ##   ##   ##     
  ##     ########    ##     ##         ##     ## ##   ##   ##     ##    
 ##      ##           ##    ##         ##      ###    ##  ###      ##   
 ##       ####    #####      ###     ######    ##      ### ##  #####    
```

## Unit Testing Wisdom From An Ancient Software Start-up

Less unit testing __dogma__. More unit testing *karma*.

----

# If you write code, write tests 1/2

The pupil asked the master programmer:

> When can I stop writing tests?

The master answered:

> When you stop writing code.

The pupil asked:

> When do I stop writing code?

The master answered:

> When you become a manager.

----

# If you write code, write tests 2/2

The pupil trembled and asked:

> When do I become a manager?

The master answered:

> When you stop writing tests.

The pupil rushed to write some tests. He left skid marks.

*If the code deserves to be written, it deserves to have tests.*

----

# Don’t get stuck on unit testing dogma

Dogma says:

> Do this.

> Do only this.

> Do it only this way.

> And do it because I tell you.

Dogma is __inflexible__. Testing needs flexibility.

Dogma kills creativity. Testing needs creativity.

----

# Embrace unit testing karma

Karma says:

> Do good things and good things will happen to you.

> Do them the way you know.

> Do them the way you like.

Karma is *flexible*. Testing needs flexibility.

Karma thrives on creativity. Testing needs creativity.

----

# Think of code and test as one

- When writing the code, think of the test.

- When writing the test, think of the code.

- *When you think of code and test as one, testing is easy and code is beautiful.*

----

# The test is more important than the unit 1/2

The pupil asked the great master programmer Flying Feathers:

> What makes a test a unit test?

This great master programmer answered:

> If it talks to the database, it is not a unit test.

> If it communicates across the network, it is not a unit test.

> If it touches the file system, it is not a unit test.

> If it can’t run at the same time as any other unit tests, it is not a unit test.

> If you have to do special things to your environment to run it, it is not a unit test.

----

# The test is more important than the unit 2/2

Other master programmers, hearing this conversation, jumped in with dissenting opinions and started to argue loudly.

“Sorry I asked”, said the pupil as he left. Later that night, he received a note from the great grand master programmer:

> The answer from the great master Flying Feathers is an excellent guide. If you follow it *most of the time* you will do well. But __don’t get stuck__ on any dogma. *Write the test that needs to be written*.

The pupil slept well. The other masters continued to argue long into the night.

----

# The best time to test is when the code is fresh

Your code is like clay. When it’s fresh, it’s soft and malleable. As it ages, it becomes hard and brittle.

If you write tests *when the code is fresh* and easy to change, *testing will be easy*, and both the code and the *tests will be strong*.

If you write the tests __when the code is old__ and hard to change, __testing will be hard__ and both the code and the __tests will be brittle__.

----

# An imperfect test today is better than a perfect test someday

- The perfect is the enemy of the good.

- Don’t wait for best to do better.

- Don’t wait for better to do good.

- Write the test you can *today*.

----

# An ugly test is better than no test

- When the code is ugly, the tests may be ugly.

- You don’t like to write ugly tests, but *ugly code needs testing the most*.

- Don’t let ugly code stop you from writing tests, but let ugly code stop you from writing more of it.

----

# Tests not run waste away

- Run your tests often.

- Don’t let them get __stale__.

- Rejoice when they *pass*.

- Rejoice when they *fail*.

----

# Good tests fail

The pupil went to the master programmer and said:

> All my tests pass all the time. Don’t I deserve a raise?

The master slapped the pupil and replied:

> If all your tests pass, all the time, you need to write better tests.

With a red cheek, the pupil went to HR to complain.

But that’s another story.

----

# Thank you

Questions?


