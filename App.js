import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Images} from './src/assets/Images';

const App = () => {
  const [firstSelected, setFirstSelected] = useState(null);
  const [secondSelectedCard, setSecondSelectedCard] = useState(-1);
  const [selectedCard, setSelectedCard] = useState(-1);
  const [counting, setCounting] = useState({match: 0, turnes: 0});
  const [RendomData, setRendomData] = useState(null);

  const shuffleArray = array => {
    // Create a copy of the original array to avoid mutating it
    const shuffledArray = [...array];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  };

  useEffect(() => {
    if (RendomData == null) {
      const Data = Object.values(Images).map((item, index) => {
        return {image: item, id: index + 1, hide: false};
      });
      setRendomData(shuffleArray([...Data, ...Data]));
    }
  }, [onReload, RendomData]);

  const onOpenCard = (item, index) => {
    if (firstSelected == null) {
      setFirstSelected(item.id);
      setSelectedCard(index);
    } else {
      setSecondSelectedCard(index);
      setTimeout(() => {
        if (item.id == firstSelected) {
          RendomData[index].hide = true;
          RendomData[selectedCard].hide = true;
          setCounting(prev => {
            return {...prev, match: prev.match + 1};
          });
        }
        setFirstSelected(null);
        setSecondSelectedCard(-1);
        setSelectedCard(-1);
        setCounting(prev => {
          return {...prev, turnes: prev.turnes + 1};
        });
      }, 100);
    }
  };
  const onReload = () => {
    setFirstSelected(null);
    setSecondSelectedCard(-1);
    setSelectedCard(-1);
    setCounting({match: 0, turnes: 0});
    setRendomData(null);
  };
  return (
    <View style={styles.mainView}>
      <View>
        <FlatList
          data={RendomData}
          numColumns={4}
          renderItem={({item, index}) => (
            <TouchableOpacity
              disabled={
                secondSelectedCard > -1 ||
                index == selectedCard ||
                index == secondSelectedCard ||
                item.hide
              }
              onPress={() => onOpenCard(item, index)}
              style={[
                {
                  backgroundColor: item.hide ? '#65E65F' : '#D7DFA2',
                },
                styles.card,
              ]}>
              {!item.hide &&
                (index == selectedCard || index == secondSelectedCard) && (
                  <Image source={item.image} style={styles.cardImage} />
                )}
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.countView}>
        <Text style={styles.countText}>Match Count : {counting.match}</Text>
        <Text style={styles.countText}>Turnes Count : {counting.turnes}</Text>
      </View>
      <TouchableOpacity onPress={onReload} style={styles.button}>
        <Text style={styles.buttonTitle}>Reload</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  mainView: {flex: 1, justifyContent: 'center', marginHorizontal: 10},
  card: {
    flex: 1,
    margin: 5,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {resizeMode: 'center'},
  countView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  countText: {fontSize: 20, fontWeight: '600'},
  button: {
    padding: 10,
    width: '90%',
    backgroundColor: 'skyblue',
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonTitle: {color: '#fff', fontWeight: 'bold'},
});
