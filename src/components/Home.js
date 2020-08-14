import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  RefreshControl,
} from "react-native";
import { connect } from "react-redux";
import apiCall from "../actions/ActionCreator";
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from "recyclerlistview";

const SCREEN_WIDTH = Dimensions.get("window").width;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { refreshing: true };
    this.props
      .apiCall("https://swapi.dev/api/people/")
      .then(() => {
        const data = this.props.data;
        this.setState({
          data,
          refreshing: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(this.props.data),
    };
    this.layoutProvider = new LayoutProvider(
      (i) => {
        return this.state.dataProvider.getDataForIndex(i).homeworld;
      },
      (homeworld, dim) => {
        switch (homeworld) {
          case "http://swapi.dev/api/planets/1/":
            dim.width = SCREEN_WIDTH;
            dim.height = 100;
            break;
          default:
            dim.width = 0;
            dim.height = 0;
            break;
        }
      }
    );
  }

  componentDidMount() {}
  onRefresh() {
    //Clear old data of the list
    this.setState({ refreshing: false });
    //Call the Service to get the latest data
  }
  rowRenderer = (homeworld, data) => {
    const { name, height, hair_color, skin_color, gender } = data;
    return (
      <View style={styles.item}>
        <View style={styles.body}>
          <Text>Name:{name}</Text>
          <Text>Height:{height}</Text>
          <Text>Hair Color:{hair_color}</Text>
          <Text>Skin Color:{skin_color}</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <RecyclerListView
          style={{ flex: 1 }}
          dataProvider={this.state.dataProvider}
          layoutProvider={this.layoutProvider}
          rowRenderer={this.rowRenderer}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              ></RefreshControl>
            ),
          }}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  apiCall: (url) => dispatch(apiCall(url)),
});

const mapStateToProps = (state) => ({
  data: state.apiReducer.data,
  error: state.apiReducer.error,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  item: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  body: {
    flexDirection: "column",
    marginTop: 40,
  },
});
