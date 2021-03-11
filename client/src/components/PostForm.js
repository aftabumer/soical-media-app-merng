import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { CREATE_POST_MUTATION, FETCH_POSTS_QUERY } from "../util/graphql";
import { useForm } from "../util/hooks";

const PostForm = () => {
  const [error, setError] = useState("");
  const { values, onChange, onSubmit } = useForm(createPostCallBack, {
    body: "",
  });
  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          ...data,
          getPosts: [...data.getPosts, result],
        },
      });
      values.body = "";
    },
    onError(err) {
      console.log(err.graphQLErrors[0].message);
      setError(err.graphQLErrors[0].message);
    },
  });

  function createPostCallBack() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h2>Create a post</h2>
        <Form.TextArea
          className="text-area-container"
          palceholder="Hi World!"
          name="body"
          value={values.body}
          onChange={onChange}
          rows={3}
          // error={error ? true : false}
          error={
            error
              ? {
                  content: error,
                  pointing: "below",
                }
              : false
          }
        />
        <Button
          type="Submit"
          color="teal"
          className="post-submit-btn"
          floated="right"
          // loading={loading ? true : false}
        >
          Submit
        </Button>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            <li>{error}</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default PostForm;
