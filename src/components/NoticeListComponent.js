import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

const NoticeListComponent = ({
  notices,
  currentPage,
  totalPages,
  setCurrentPage,
  showPagination,
}) => {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.noticeIdx}>{item.noticeIdx}</Text>
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeDate}>{item.createDate}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTextIdx}>번호</Text>
      <Text style={styles.headerTextTitle}>제목</Text>
      <Text style={styles.headerTextDate}>작성일</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        renderItem={renderItem}
        keyExtractor={item => item.noticeIdx.toString()}
        ListHeaderComponent={renderHeader}
      />
      {showPagination && (
        <View style={styles.pagination}>
          <Button
            title="이전"
            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          />
          <Text style={styles.pageInfo}>
            {currentPage + 1} / {totalPages}
          </Text>
          <Button
            title="다음"
            onPress={() =>
              setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  headerTextIdx: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTextTitle: {
    flex: 4,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTextDate: {
    flex: 2,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noticeIdx: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  noticeTitle: {
    flex: 4,
    fontSize: 16,
    marginLeft: 20,
    textAlign: 'left',
  },
  noticeDate: {
    flex: 2,
    fontSize: 16,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  pageInfo: {
    fontSize: 16,
  },
});

export default NoticeListComponent;
