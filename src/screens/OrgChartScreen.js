import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Avatar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchOrgEmpList } from '../api/fetchOrgEmpList'; // 경로는 실제 경로에 맞게 조정

export default function OrgChartScreen() {
  const [orgList, setOrgList] = useState([]);
  const [empList, setEmpList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const data = await fetchOrgEmpList();
          setOrgList(data.orgList);
          setEmpList(data.empList);
        } catch (error) {
          console.error('Error loading data', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [])
  );

  useEffect(() => {
    const buildTreeData = (orgList, empList) => {
      const orgMap = {};

      orgList.forEach(org => {
        orgMap[org.orgCd] = {
          title: org.orgName,
          key: org.orgCd,
          children: [],
          isOrg: true,
        };
      });

      empList.forEach(emp => {
        const org = orgMap[emp.orgCd];
        if (org) {
          org.children.push({
            title: `${emp.empName} (${emp.position})`,
            key: emp.empNo,
            isOrg: false,
            empData: { ...emp, orgName: org.title },
          });
        }
      });

      const treeData = [];
      const initialExpandedNodes = {};

      orgList.forEach(org => {
        initialExpandedNodes[org.orgCd] = true; // Set all nodes as expanded
        if (org.upperOrgCd) {
          orgMap[org.upperOrgCd].children.push(orgMap[org.orgCd]);
        } else {
          treeData.push(orgMap[org.orgCd]);
        }
      });

      setExpandedNodes(initialExpandedNodes);
      setTreeData(treeData);
    };

    if (orgList.length > 0 && empList.length > 0) {
      buildTreeData(orgList, empList);
    }
  }, [orgList, empList]);

  const toggleNode = key => {
    setExpandedNodes(prevState => ({ ...prevState, [key]: !prevState[key] }));
  };

  const likeSearch = (obj, query) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string' && obj[key].includes(query)) {
        return true;
      }
    }
    return false;
  };

  const filterTree = (nodes, query) => {
    return nodes
      .map(node => {
        if (node.isOrg) {
          const filteredChildren = filterTree(node.children, query);
          if (filteredChildren.length > 0 || node.title.includes(query)) {
            return { ...node, children: filteredChildren };
          }
        } else if (
          node.title.includes(query) ||
          likeSearch(node.empData, query)
        ) {
          return node;
        }
        return null;
      })
      .filter(node => node !== null);
  };

  const renderTree = (nodes, level = 0) => {
    return nodes.map(node => (
      <View
        key={node.key}
        style={[styles.nodeContainer, { paddingLeft: level * 20 }]}
      >
        <TouchableOpacity
          onPress={() =>
            node.isOrg
              ? toggleNode(node.key)
              : navigation.navigate('EmpDetail', { empData: node.empData })
          }
          style={styles.nodeContent}
        >
          {node.isOrg ? (
            <Avatar.Icon
              size={24}
              icon="folder"
              color="white"
              style={{ backgroundColor: 'orange' }}
            />
          ) : (
            <Avatar.Icon
              size={24}
              icon="account"
              color="white"
              style={{ backgroundColor: 'orange' }}
            />
          )}
          <Text style={styles.nodeText}>{node.title}</Text>
        </TouchableOpacity>
        {node.children &&
          node.children.length > 0 &&
          expandedNodes[node.key] &&
          renderTree(node.children, level + 1)}
      </View>
    ));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  const filteredTreeData = filterTree(treeData, search);

  return (
    <View style={styles.container}>
      <TextInput
        label="이름/아이디/부서/직위/전화"
        value={search}
        onChangeText={text => setSearch(text)}
        style={styles.search}
      />
      <ScrollView>{renderTree(filteredTreeData)}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  search: {
    margin: 10,
    backgroundColor: '',
  },
  nodeContainer: {
    flexDirection: 'column',
    marginVertical: 5,
  },
  nodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nodeText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
