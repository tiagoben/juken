import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import theme from 'src/common/theme';
import os from 'src/utils/os';
import sheet from 'src/utils/sheet';
import { TERMINOLOGY } from 'src/common/constants';

import CardCover from 'src/components/Card/CardCover';
import CardHeader from 'src/components/Card/CardHeader';
import Question from 'src/components/Card/Question';
import LongPressButton from 'src/components/Button/LongPressButton';

const DirectionLeftIcon = () => (
  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
    <AntDesign name="caretleft" size={10} color={theme.color.incorrect} />
    <AntDesign name="frowno" size={18} color={theme.color.incorrect} />
  </View>
);

const DirectionRightIcon = () => (
  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
    <AntDesign name="smileo" size={18} color={theme.color.correct} />
    <AntDesign name="caretright" size={10} color={theme.color.correct} />
  </View>
);

const Card = ({
  empty,
  deckProps = {},
  reviewType,
  subjectType,
  reviewQuestion,
  reviewAnswer,
}) => {

  const {
    isFirstCard,
    isSecondCard,
    getClearInterpolation,
    // getMovementInterpolation,
    // swipeLock,
    setSwipeLock,
  } = deckProps;

  // keep reveal state locally within each card
  const [ revealed, setRevealed ] = useState(false);

  // update swipe lock based local revealed state
  useEffect(() => {
    setSwipeLock(!revealed);
  }, [
    revealed,
    isFirstCard
  ])

  // empty card
  if (empty) {
    return <View style={styles.wrapper} />;
  }

  return (
    <View style={styles.wrapper}>
      
      {/* red / green cover */}
      {isFirstCard && (
        <CardCover
          getClearInterpolation={getClearInterpolation}
        />
      )}

      {/* card contents */}
      {(isFirstCard || isSecondCard) && (
        <View style={styles.container}>

          {/* top header */}
          <CardHeader
            leftIcon={revealed ? <DirectionLeftIcon /> : null}
            rightIcon={revealed ? <DirectionRightIcon /> : null}
            centerText={revealed
              ? (os('desktop') ? 'Arrow Keys' : 'Swipe')
              : (TERMINOLOGY[subjectType] || '')
            }
          />

          {/* question and question statement */}
          <Question 
            revealed={revealed}
            answer={reviewAnswer}
            question={reviewQuestion}
            reviewType={reviewType}
            subjectType={subjectType}
          />

          {/* reveal button */}
          <View style={{ height: 52 }}>
            {!revealed && (
              <LongPressButton
                text="Reveal"
                onComplete={() => {
                  setRevealed(true)
                }}
              />
            )}
          </View>
        </View>
      )}
      
    </View>
  );
};

Card.propTypes = {
  empty: PropTypes.bool,
  deckProps: PropTypes.object,
  subjectType: PropTypes.string,
  reviewType: PropTypes.string,
  reviewQuestion: PropTypes.string,
  reviewAnswer: PropTypes.string,
};

const styles = StyleSheet.create({
  wrapper: sheet({
    base: {
      flex: 1,
      position: 'relative',
      backgroundColor: theme.bg.card,
      borderRadius: theme.radius.card,
    },
    web: {
      userSelect: 'none',
    },
  }),
  container: {
    flexGrow: 1,
    padding: theme.padding.card,
  }
  
})

export default Card;