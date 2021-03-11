import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { DELETE_POST_BY_ID_MUTATION, FETCH_POSTS_QUERY } from "../util/graphql";

const DeleteButton = ({ postId, callBack }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST_BY_ID_MUTATION, {
    update(proxy) {
      setConfirmOpen(false);
      if (callBack) callBack();
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          ...data,
          getPosts: data.getPosts.filter((post) => post.id !== postId),
        },
      });
    },
    variables: {
      postId,
    },
  });
  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onConfirm={deletePost}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default DeleteButton;
