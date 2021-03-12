import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Icon,
  Label,
  Image,
  Grid,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import {
  FETCH_POST_BY_ID_QUERY,
  SUBMIT_COMMENT_MUTATION,
} from "../util/graphql";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

const SinglePost = ({ history, match }) => {
  const postId = match.params.postId;
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState("");
  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);

  const { data } = useQuery(FETCH_POST_BY_ID_QUERY, {
    variables: { postId },
  });

  useEffect(() => {
    if (data) {
      setPost(data["getPost"]);
    }
  }, [data]);

  const [submitComment, { loading }] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  let postMarkup;
  if (!post) {
    postMarkup = <p>Loading post..</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = post;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="large"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={12}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log("Comment on post")}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton
                    postId={id}
                    callBack={() => history.push("/")}
                  />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <h5 style={{ margin: "1em" }}>Post a comment</h5>
                <Card.Content>
                  <Form onSubmit={submitComment}>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <Button
                        type="Submit"
                        color="teal"
                        disabled={comment.trim() === ""}
                        loading={loading ? true : false}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                  {/* <Form
                    onSubmit={submitComment}
                    className={loading ? "loading" : ""}
                  >
                    <Form.Input
                      name="comment"
                      type="text"
                      placeholder="Comment.."
                      value={comment}
                      style={{ width: "100%" }}
                      onChange={(event) => setComment(event.target.value)}
                    />
                    <Button
                      type="Submit"
                      color="teal"
                      floated="right"
                      disabled={comment.trim() === ""}
                      loading={loading ? true : false}
                    >
                      Submit
                    </Button>
                  </Form> */}
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};

export default SinglePost;
