import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";
import { REGISTER_USER_MUTATION } from "../util/graphql";
import { useForm } from "../util/hooks";

const Register = ({ history }) => {
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER_MUTATION, {
    update(_, result) {
      history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }
  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={
            errors && errors.username
              ? Object.keys(errors).length > 0 && {
                  content: errors["username"],
                }
              : false
          }
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
          error={
            errors && errors.email
              ? Object.keys(errors).length > 0 && {
                  content: errors["email"],
                }
              : false
          }
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          error={
            errors && errors.password
              ? Object.keys(errors).length > 0 && {
                  content: errors["password"],
                }
              : false
          }
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={onChange}
          error={
            errors && errors.confirmPassword
              ? Object.keys(errors).length > 0 && {
                  content: errors["confirmPassword"],
                }
              : false
          }
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 ? (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Register;
