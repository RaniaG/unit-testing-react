# Unit Testing using Jest and React Testing Library
A Comprehensive Guide into Writing Unit tests in React using Jest and React Testing Library<br>

<!-- Intro 

Why we need automated testing, why unit testing is important. Each type of testing serves a different value.

-->

## Types Of Front-end Automated Tests:
### Unit Testing
Testing a single unit of code, without any external dependencies. <br>
This unit could be a function, a class, or a component.
### Integration Testing
Testing the integration/interaction between two or more units of code.<br>
For example:
- integration parent and child components
- integration between component and API service
- integration between backend service and database

Integration testing can also be categorised into the following types:
#### Shallow integration Testing
We don’t care about the implementation detail of the dependency; we only test the interaction/integration between two units.<br>
```javascript
export const TestComponent = () => {
  const [loading, setLoading] = useState();
  const [result, setResult] = useState();
  const [showError, setShowError] = useState();

  useEffect(() => {
    setLoading(true);
    api
      .getResult()
      .then((result) => setResult(result))
      .catch((err) => setShowError(true));
  }, []);
  return (
    <div>
      {loading ? (
        <h4>Loading...</h4>
      ) : showError ? (
        <span>Sorry an error occured. Please try again</span>
      ) : (
        <h2>The result is: {result}</h2>
      )}
    </div>
  );
};

```
For the previous code example: we test that `TestComponent` calls `api.getResult()`, and how the component reacts when the service call succeeds/fails. <br>
i.e: Error appears, success message appears, loading appears...etc.<br>
But we don’t get into the details of how `getResult` is implemented.

#### Deep integration Testing
Testing a unit of code and its dependency’s behavior.<br> For the same example above: 
In Deep integration testing; We would test the behavior of function `getResult` and its implementation details. 

### End-to-End Testing
Testing a live running Application, starting with the UI until DB operations.<br>
We make sure an entire flow is working as designed.<br> For example:
- registering a new user (starting from registration from until it shows up in the list of users) 
E2E also works works with real APIs and real UI components. i.e: we don't mock the API or child components.


> For the sake of this article, we will be focusing on **unit testing, and shallow integration testing**.

## Tools

In this article we are using Jest and React Testing Library
They are recommended by React documentation, and there is a huge community and a very good documentation for both.<br>
Lets install latest version of both:
```
npm i jest
npm i @testing-library/react
```

## Important Concepts for unit testing
### Mocking
Most of our units have dependencies. For example:
- calling a different function
- calling an API service
- having a nested Child component
...etc

<br>In order to test our unit of code separately without those dependencies, we use mocking.<br>
Mocking is simply creating a copy/clone of the dependency with the same signature, that will behave any way we want it to.<br>
That means that whenever the dependency is being called/invoked in the code, the mocked copy will be used.<br>

#### Module mock using `__mocks__` folder<br>
The Simplest method is to create `__mocks___` folder next to the module we want to mock.<br>
For example:
   - `models`
      - `user.js`
      - `__mocks__`
         - `user.js`


#### Module mock using `mock` function<br>
`jest.mock('axios')`
This will mock the entire axios module, so we wont make any real API calls<br>
However we need to define some functions otherwise when `axios.get` is called, we will get an error because get will be undefined<br>
So we need to define the methods that will be used from the mocked module as follows:
```javascript
jest.mock('axios', () => {
  return {
    get: jest.fn(() => {}),
  };
});
```
If we only want to mock one function from a module, but keep the rest of the functions unmocked, then we can use the original module:
```javascript
jest.mock('recoil', ()=>{
  const originalModule = jest.requireActual('recoil');
  return {
    ...originalModule,
    useRecoilValue: jest.fn(()=> ({})),
  };
});
```
Here we are only mocking `useRecoilValue` from recoil.
**Note: the 'jest.mock' method must be called outside of any tests, it will be executed before running any test**

#### The `spyOn` method<br>
This method can be used for each test, when we want to change the behavior of a function based on the current test.<br>
It allows us to change the implementation, return value, resolved or rejected values or a promise...etc
```javascript
    jest.spyOn(recoil, 'useRecoilValue').mockReturnValueOnce({
      username: oldUsername,
    });
```

### Coverage
So after we start writing tests, we want to be able to measure how good our tests are.<br>
Coverage report gives us metrics about the *code that was executed*, while running our tests.<br>
So it tells us if we missed a few lines of code while testing and so on.<br>
Here is an example of coverage report metrics:
- how many lines of code
- how many branches ( if conditions, switch cases, loops ...etc) did we cover
- how many functions

#### A very important note to consider
> High Code Coverage doesn't ensure quality 
Sometimes developers can write a test that executes all lines of code but simply does nothing!
```javascript
it("should display No Alert! when rendered if message is undefined", () => {
  //Arrange
  //Act
  render(<Alert />);
  //Assert
  expect(true).toBeTruthy();
});
```
this example will pass and give a 100% code coverage, however it doesn't really test anything.
So it is important to rely on coverage but it doesn't eleminate the need for code review and writing good tests.
### Flaky tests
Flaky tests are defined as tests that return both passes and failures despite no changes to the code or the test itself.
similar to the example mentioned here:
```javascript
it("should display No Alert! when rendered if message is undefined", () => {
  //Arrange
  //Act
  render(<Alert />);
  //Assert
  expect(true).toBeTruthy();
});
```

## Basic tips for writing good tests:
Organization is important for writing good tests. <!-- TODO: elaborate more -->

### Naming
It is recommended to write tests in a separate file and name the test file with the same name as the unit under test. <br>
For example: 
For `Login.jsx`, we would name the test file `Login.spec.jsx` or `Login.test.jsx`

### Folder structure
It is recommended to keep the test file as close to the unit under test as possible to make the relative imports easier and more readable.<br>
We can either place them in the same folder or create a separate `__tests__` folder for the tests.<br>
For example:
- `Login`
  - `Login.jsx`
  - `__tests__`
    - `Login.spec.jsx`

or 
- `Login`
  - `Login.jsx`
  - `Login.spec.jsx`
  
Note: It is not recommended to put all the tests of the Application into a separate tests folder, as it will be longer path for imports.

### Structure of the test
#### Test title
A descriptive name for the test is as important as the test itself.<br>
It’s important that the name of the test describes what it is doing so whoever reads the name doesn’t need to drill into the name.<br>
There are too many recommended ways to name tests (you can find them referenced below), but all of them agree that a name should mention ‘state under test’ and ‘expected behavior’.<br>
For example:<br>
```
‘Should throw exception when age is null’
‘Should render icon when loaded’
```

#### Test organisation
There is a famous strategy when writing tests, which is to divide the test into three parts<br>
**Arrange, Act, Assert**<br>
- In the **Arrange** part we will do all our setup; define variables, spy on functions…etc
- In the **Act** part we will do the action; call a function, submit a form, click a button.
- In the **Assert** part we will do our expect calls; expect a text to be in the document, expect result to equal a value …etc

### Repeating tests logic
Sometimes we want to execute the same test, but for different input/output combinations.<br>
we can use `test.each` which allows us to execute the same test for diferent parameters.<br>
Here is an example:
instead of writing tests like the following
```javascript
it('should have className alert-success when the type = success',()=>{
      //Arrange
  //Act
  render(<Alert message="test" type='success' />);
  //Assert
  expect(screen.getByRole("alert")).toHaveAttribute("class", "alert-success");
})

it('should have className alert-error when the type = error',()=>{
      //Arrange
  //Act
  render(<Alert message="test" type='error' />);
  //Assert
  expect(screen.getByRole("alert")).toHaveAttribute("class", "alert-error");
})
```
we can write it as
```javascript
it.each([
  ["alert-success", "success"],
  ["alert-error", "error"],
])("should have className %p when the type = %p", (expectedClassname, type) => {
  //Arrange
  //Act
  render(<Alert message="test" type={type} />);
  //Assert
  expect(screen.getByRole("alert")).toHaveAttribute("class", expectedClassname);
});
```

### Important Rule to remember
Always try to fail a test after it succeeds to make sure it is properly working and not affected by async code and to make sure it is not a flaky test.

## Writing Unit tests for Functions

### Testing a simple function
Lets take an example to write unit tests for the following simple function:
```javascript
export const formatString = (abc = "") => {
  try {
    if (!abc) return "";
    return abc.replace(" ", "\n").toLowerCase();
  } catch (e) {
    return "";
  }
};
```
1. Start by brainstorming all the tests you are planning to write covering all the branches and if conditions

- should return empty string when input string is null
- should return empty string when input string is undefined
- should return empty string when no input string is passed as arguemnt
- should replace all spaces with new lines in the input string
- should lowercase all the words in the input string
- should return empty string if there is any error thrown

2. Divide each test into three As (Arrange, Act, Assert)
```javascript
  it("should return empty string when input string is null", () => {
    //Arrange
    //Act
    //Assert
  });
```
3. Write down the logic of each Area
```javascript
  it("should return empty string when input is null", () => {
    //Arrange
    const inputString = null;
    const expectedString = "";
    //Act
    const result = formatString(inputString);
    //Assert
    expect(result).toEqual(expectedString);
  });
  ```
4. Make sure the test succeeds
5. Try to change the expected value so the test fails, to make sure it is a valid test
 ```javascript
  it("should return empty string when input is null", () => {
    //Arrange
    const inputString = null;
    const expectedString = "invalid";
    //Act
    const result = formatString(inputString);
    //Assert
    expect(result).toEqual(expectedString);
  });
  ```
### Testing a function with external dependency
Lets try a more complex example for the following function that has an external dependency:
```javascript
export const sendEmail = (email: string, content: string) => {
  if (!email) throw new Error("email is required");
  if (!content) throw new Error("content is required");
  if (!email.match(/.+\@.+\..+/g)) throw new Error("email must match required format");
  return sendEmailRequest(email, content).catch((err) => {
    log(err);
    throw new Error(err);
  });
};
```
We want to make sure that we do **Shallow Integration Testing** so we don't want to test the implementation details of `sendEmailRequest` function.<br> We only want to test how our function interacts with it.
1. Since we dont want to really call the external dependency, so we need to mock it:
```javascript
    jest
      .spyOn(api, "sendEmailRequest")
      .mockImplementationOnce(() => {})
```
we can mock the return value differently per test:
```javascript
jest.spyOn(api, "sendEmailRequest").mockResolvedValue(true);
jest.spyOn(api, "sendEmailRequest").mockRejectedValueOnce({});
```
2. We need to make sure to test that the external dependency is being invoked:
```javascript
  it("should invoke sendEmailRequest with valid parameters", () => {
    //Arrange
    const sendEmailRequestSpy = jest.spyOn(api, "sendEmailRequest");
    //Act
    sendEmail("email@email.com", "content");
    //Assert
    expect(sendEmailRequestSpy).toBeCalledWith("email@email.com", "content");
  });
```
3. We also need to test how our function behaves for different expected return values from dependency
```javascript
  it("should return the value from sendEmailRequest when it is successful", async () => {
    //Arrange
    jest
      .spyOn(api, "sendEmailRequest")
      .mockResolvedValue("email is successful");
    //Act
    const result = await sendEmail("email@email.com", "content");
    //Assert
    expect(result).toEqual("email is successful");
  });
  
```

## Writing Unit tests for Components
Testing Components is pretty similar to Functions, however, most of the complexity comes from setup, dependencies, and sideEffects.
### Testing a simple component
Lets start with a simple component without any dependencies:
```javascript
export const Alert = ({ type, message }) => {
  return (
    <span
      role="alert"
      className={type === "success" ? "alert-success" : "alert-error"}
    >
      {message ?? "No Alert!"}
    </span>
  );
};

```
1. We follow the same steps for writing a function but we use RTL's `render` function 
```javascript
import { render } from "@testing-library/react";

render(<Alert message="test" />);
```
2. Use methods provided by RTL that makes selecting elements much easier
```javascript
it("should display the input message when rendered", () => {
  //Arrange
  //Act
  render(<Alert message="test" />);
  //Assert
  expect(screen.getByRole("alert")).toHaveTextContent("test");
});

it("should display No Alert! when rendered if message is undefined", () => {
  //Arrange
  //Act
  render(<Alert />);
  //Assert
  screen.getByText("No Alert!"); // this will throw an error if element is not found so the test will fail
});

it.each([
  ["alert-success", "success"],
  ["alert-error", "error"],
])("should have className $p when %s", (expectedClassname, type) => {
  //Arrange
  //Act
  render(<Alert message="test" type={type} />);
  //Assert
  expect(screen.getByRole("alert")).toHaveAttribute("class", expectedClassname);
});
```
### Testing a component with state changes
Lets try a more complex example for a component that changes state and interacts with children components
```javascript
export const Form = ({ headline }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const inputEl = useRef(null);
  const onSubmit = () => {
    api
      .postForm(inputEl.current.value)
      .then(() => {
        setShowAlert(true);
        setAlertType("success");
        setAlertMessage("Post Success");
      })
      .catch(() => {
        setShowAlert(true);
        setAlertType("fail");
        setAlertMessage("Failed to post. Please try again");
      });
  };
  return (
    <div>
      {headline && <h2>{headline}</h2>}
      {showAlert && <Alert type={alertType} message={alertMessage} />}
      <input type="text" name="username" ref={inputEl} />
      <button type="submit" onClick={() => onSubmit()}>
        Submit
      </button>
    </div>
  );
};
```
1. Since we don't want to test the implementation details of the child component, we should first mock the `Alert` component
```javascript
const mockAlert = jest.fn();

jest.mock("../Alert/Alert", () => {
  return {
    Alert: jest.fn((props) => {
      mockAlert(props);
      return <div>Alert Mock</div>;
    }),
  };
});
```
Mocking a component is very similar to mocking a module, each time the Alert component is used, this `<div>Alert Mock</div>` content will be rendered instead.<br>
As for the `mockAlert` function, we are using it so we can listen/spy on props that are passed to the `Alert` component.
<br>**Note: jest only allows this naming convension `mockAlert` (prefexed with mock) to be referenced inside `jest.mock`**<br>
2. We can make sure that the Alert is not invoked with component is rendered since showAlert is always false in the beginning
```javascript
it("should not render Alert when rendered ", () => {
  //Arrange
  //Act
  render(<Form />);
  //Assert
  expect(mockAlert).not.toBeCalled();
});

```
3. We will also mock the API `postForm` using any of the three methods we defined previously.
4. Now lets try to fire the click event and test the Alert behavior for success and failure
```javascript
it("should set type=success and message=Post Success to Alert ", async () => {
  //Arrange
  render(<Form headline="test" />);
  //Act
  screen
    .getByRole("button", {
      name: /Submit/i,
    })
    .click();
  //Assert
  await waitFor(() => {
    expect(mockAlert).toHaveBeenCalledWith({
      type: "success",
      message: "Post Success",
    });
  });
});

it("should set type=fail and message='Failed to post. Please try again' to Alert ", async () => {
  //Arrange
  jest.spyOn(api, "postForm").mockRejectedValueOnce({});
  render(<Form headline="test" />);
  //Act
  screen
    .getByRole("button", {
      name: /Submit/i,
    })
    .click();
  //Assert
  await waitFor(() => {
    expect(mockAlert).toHaveBeenCalledWith({
      type: "fail",
      message: "Failed to post. Please try again",
    });
  });
});
```
## Writing Unit tests for Async code
Writing tests for async code can be very challenging, RTL has very helpful utilities.
### findBy
findBy can be useful when we want to assert an element exists, or we want to interact with an element, but that element hasn't appeared into view yet.
<br>It will appear after some async code is executed.
<br> For example: we want to test that the alert appears after api response is successful:
```javascript
it("should render alert when api response is success", async () => {
  //Arrange
  jest.spyOn(api, "postForm").mockResolvedValue({});
  render(<Form headline="test" />);
  //Act
  screen
    .getByRole("button", {
      name: /Submit/i,
    })
    .click();
  //Assert
  await screen.findByText("Alert Mock");
});
```
### waitFor
we can use waitFor when we want to test some logic some async logic. It will wait for a period of time until the `expect` inside it succeeds<br>
we aleady used waitFor in the previous example because the Alert will only appear after the promise rejects.
```diff
it("should set type=fail and message='Failed to post. Please try again' to Alert ", async () => {
  //Arrange
  jest.spyOn(api, "postForm").mockRejectedValueOnce({});
  render(<Form headline="test" />);
  //Act
  screen
    .getByRole("button", {
      name: /Submit/i,
    })
    .click();
  //Assert
+  await waitFor(() => {
    expect(mockAlert).toHaveBeenCalledWith({
      type: "fail",
      message: "Failed to post. Please try again",
    });
  });
});
```
### Very important note for testing async code
We talked before about failing tests to make sure they are not flaky. But if we try to fail the previous test by adding a `.not` you will see that the ***test still succeeds***
```diff
  await waitFor(() => {
+    expect(mockAlert).not.toHaveBeenCalledWith({
      type: "fail",
      message: "Failed to post. Please try again",
    });
  });
```
This happened because waitFor will wait until the `expect` succeeds.<br>
And in the first render of this component, `mockAlert` wasn't called, so the test succeeds.<br>
waitFor will not wait for all promises to resolve. i.e: it will not wait for the api response to resolve in this case.<br>
So in order for to fail our test we should change the expected args `type` and `message`
```diff
  await waitFor(() => {
    expect(mockAlert).toHaveBeenCalledWith({
+      type: "wrong type",
+      message: "wrong message",
    });
  });
```
this will surely fail, because `mockAlert` is never called with these args

## Debugging Tests

### vscode debugging
debugging in vscode is very simple
1. add launch.json file from debug tab
2. add the following content
```json
{
    "version": "0.2.0",
    "configurations": [
      {
        "type": "node",
        "request": "launch",
        "name": "Jest single run all tests",
        "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
        "args": [
          "--verbose",
          "-i",
          "--no-cache"
        ],
        "console": "integratedTerminal",
        "internalConsoleOptions": "neverOpen"
      },
      {
        "type": "node",
        "request": "launch",
        "name": "Jest watch all tests",
        "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
        "args": [
          "--verbose",
          "-i",
          "--no-cache",
          "--watchAll"
        ],
        "console": "integratedTerminal",
        "internalConsoleOptions": "neverOpen"
      },
      {
        "type": "node",
        "request": "launch",
        "name": "Jest watch current file",
        "program": "${workspaceFolder}/node_modules/jest/bin/jest",
        "args": [
          "${fileBasename}",
          "--verbose",
          "-i",
          "--no-cache",
          "--watchAll"
        ],
        "console": "integratedTerminal",
        "internalConsoleOptions": "neverOpen"
      }
    ]
  }
```
3. add your breakpoints and choose any of the defined options from debug tab
4. start debugging

#### Jest preview
[Jest Preview](https://www.jest-preview.com/docs/getting-started/intro/) is a good package that allows us to visually debug the current dom tree under test. <br>
It is useful when test is failing and you can't see why an element isn't found by jest for example.
for usage you can follow the [documentation](https://www.jest-preview.com/docs/getting-started/usage/)

## References

#### 3As:
https://xp123.com/articles/3a-arrange-act-assert/ <br>

#### RTL queries: 
https://testing-library.com/docs/queries/about/ <br>
https://testing-library.com/docs/react-testing-library/cheatsheet <br>
https://testing-library.com/docs/react-testing-library/api#render <br>

#### Jest expect:
https://jestjs.io/docs/expect <br>

#### Testing async functions:
https://testing-library.com/docs/dom-testing-library/api-async <br>

#### Testing formik:
https://testing-library.com/docs/example-react-formik/ <br>
https://github.com/bmvantunes/youtube-react-testing-video8-forms-react-testing-library <br>

#### Fixing very common error ’not wrapped in act’:
https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b <br>
https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning <br>
https://www.querythreads.com/how-to-solve-the-update-was-not-wrapped-in-act-warning-in-testing-library-react/ <br>

#### Mocking child components:
https://robertmarshall.dev/blog/react-component-props-passed-to-child-jest-unit-test/ <br>
https://robertmarshall.dev/blog/how-to-mock-a-react-component-in-jest/ <br>

#### Recommended folder structure:
https://create-react-app.dev/docs/running-tests/#filename-conventions <br>
https://medium.com/@jeff_long/organizing-tests-in-jest-17fc431ff850 <br>
https://askcodes.net/coding/jest-folder-structure <br>

#### Recommended Naming for tests:
https://medium.com/@stefanovskyi/unit-test-naming-conventions-dd9208eadbea  <br>

#### Notes about coverage:
https://daily.dev/blog/unit-testing-fraud-why-code-coverage-is-a-lie <br>
