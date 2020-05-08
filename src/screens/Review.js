import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { StyleSheet, View } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import sheet from 'src/utils/sheet';
import theme from 'src/common/theme';
import Page from 'src/components/Page/Page';
import Button from 'src/components/Button/Button';
import Card from 'src/components/Card/Card';
import Deck from 'src/components/Deck/Deck';
import Message from 'src/screens/Message';
import useReview from 'src/features/reviews/useReview';
import { logout } from 'src/features/wk/api';
import { useWkFn } from 'src/features/wk/hooks';
import extractSubject from 'src/utils/extractSubject';

const STAGE_SIZE = 5;
const RENDER_SIZE = 2;

const Review = () => {

  const { showActionSheetWithOptions } = useActionSheet();
  const [ staged, setStaged ] = useState([]);
  const logoutFn = useWkFn(logout);

  const {
    queue,
    reviewLoading,
    subjectsDict,
  } = useReview();

  useEffect(() => {
    const queueSize = queue.length;
    const fillSize = queueSize > RENDER_SIZE
    ? STAGE_SIZE - RENDER_SIZE
    : STAGE_SIZE - queueSize;

    setStaged(queue
      .slice(0, RENDER_SIZE)
      .concat(new Array(fillSize)
        .fill(null)
        .map(() => ({ id: Math.random() }))));

  }, [queue]);

  console.log('staged', staged);

  const deck = useMemo(() => (
    <Deck
      // dismiss={id => { setReviews(reviews.filter(c => c.id !== id)) }} 
      dismiss={() => {}}
      cards={staged}
      renderCard={(data, props) => {
        
        // empty cards
        if (!data) return <Card empty key={`empty-card-${props.index}`} />

        const { review, reviewType } = data;
        const subjectId = get(review, 'data.subject_id');
        const subject = get(subjectsDict, subjectId);
        const subjectType = get(subject, 'object');
        const { question, answer } = extractSubject(subject, reviewType);

        return (
          <Card
            deckProps={props}
            subjectType={subjectType}
            reviewType={reviewType}
            reviewQuestion={question}
            reviewAnswer={answer}
          />
        )
      }}
      
    />
  ), [staged]);


  if (reviewLoading) {
    return <Message loading />;
  }

  return (
    <Page scroll={false}>
      <View style={styles.deckWrapper}>
        {deck}
      </View>
      <View style={styles.buttonsWrapper}>
        <Button
          text="Options"
          onPress={() => {
            showActionSheetWithOptions({
              options: ['Cancel', 'Logout'],
              destructiveButtonIndex: 1,
            }, buttonIndex => {
              if (buttonIndex === 1) {
                logoutFn();
              }
            })
          }}
        />
      </View>
    </Page>
  )
};

Review.propTypes = {
};

const styles = StyleSheet.create({
  deckWrapper: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
    padding: theme.padding.body,
    paddingBottom: 0,
  },
  buttonsWrapper: sheet({
    base: {
      flexShrink: 0,
      width: '100%',
      padding: theme.padding.body,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  })
})

export default Review;