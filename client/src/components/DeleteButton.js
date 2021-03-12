import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Icon, Confirm } from "semantic-ui-react";
import {
  DELETE_POST_BY_ID_MUTATION,
  FETCH_POSTS_QUERY,
  DELETE_COMMENT_BY_ID_MUTATION,
} from "../util/graphql";
import ToolTip from "./ToolTip";

const DeleteButton = ({ postId, commentId, callBack }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId
    ? DELETE_COMMENT_BY_ID_MUTATION
    : DELETE_POST_BY_ID_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
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
      }
      if (callBack) callBack();
    },
    variables: {
      postId,
      commentId,
    },
  });
  return (
    <>
      <ToolTip content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </ToolTip>

      <Confirm
        open={confirmOpen}
        onConfirm={deletePostOrMutation}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default DeleteButton;
