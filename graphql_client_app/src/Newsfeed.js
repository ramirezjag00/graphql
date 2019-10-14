import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import gql from 'graphql-tag';
import { useQuery, useSubscription } from '@apollo/react-hooks';

import Posts from './Posts';
import Loading from './Loading';

const GET_POSTS = gql`
  query {
    posts {
      id
      body
      author {
        name
      }
      comments {
        id
      }
    }
  }
`;

const POST_SUBSCRIPTIONS = gql`
  subscription {
    post {
      mutation
      data {
        id
        body
        author {
          name
        }
        comments {
          id
        }
      }
    }
  }
`;

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const { loading, error, data } = useQuery(GET_POSTS);
  if (loading) {
    return <Loading loading={loading} />;
  } else if (error) {
    console.log(error);
  } else if (!loading && !error && data.posts !== posts) {
    setPosts(data.posts);
  }

  useEffect(() => {
    () => {
      const { data: datum, loading: ludeng } = useSubscription(POST_SUBSCRIPTIONS);
      if (ludeng) {
        return <Loading loading={ludeng} />;
      } else if (!ludeng) {
        setPosts([datum.post.data, posts]);
      }
    };
  });

  return (
    <View style={styles.container}>
      <Posts items={posts} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
});

export default Newsfeed;
