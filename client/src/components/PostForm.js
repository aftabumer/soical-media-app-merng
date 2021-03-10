import { useMutation } from "@apollo/client";
import React from "react";
import { Button, Form, TextArea } from "semantic-ui-react";
import { CREATE_POST_MUTATION, FETCH_POSTS_QUERY } from "../util/graphql";
import { useForm } from "../util/hooks";

const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallBack, {
    body: "",
  });
  const [createPost, { error, loading }] = useMutation(CREATE_POST_MUTATION, {
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
  });

  function createPostCallBack() {
    createPost();
  }

  return (
    <Form onSubmit={onSubmit}>
      <h2>Create a post</h2>
      <Form.Field className="text-area-container">
        <TextArea
          palceholder="Hi World!"
          name="body"
          value={values.body}
          onChange={onChange}
          rows={3}
        />
        <Button
          type="Submit"
          color="teal"
          className="post-submit-btn"
          loading={loading ? true : false}
        >
          Submit
        </Button>
      </Form.Field>
    </Form>
  );
};

export default PostForm;
