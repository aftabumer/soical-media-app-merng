import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Card, Icon, Label, Image, Grid } from "semantic-ui-react";
import moment from "moment";
import { FETCH_POST_BY_ID_QUERY } from "../util/graphql";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

const SinglePost = ({ history, match }) => {
  const postId = match.params.postId;
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState("");

  const { data, loading } = useQuery(FETCH_POST_BY_ID_QUERY, {
    variables: { postId },
  });

  useEffect(() => {
    if (data) {
      setPost(data["getPost"]);
    }
  }, [data]);

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
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
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
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};

export default SinglePost;
