import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchNoticeList } from '../api/fetchNotice';
import NoticeListComponent from '../components/NoticeListComponent';

export default function NoticeScreen() {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getNotices = async () => {
      const data = await fetchNoticeList(currentPage, 10);
      if (data) {
        setNotices(data.content);
        setTotalPages(data.totalPages);
      }
    };
    getNotices();
  }, [currentPage]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>공지사항</Text>
      <NoticeListComponent
        notices={notices}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        showPagination={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});
