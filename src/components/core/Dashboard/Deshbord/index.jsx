import { useEffect, useState } from "react";
import { apiConnector } from "../../../../services/apiconnector";
import { useSelector } from "react-redux";
import { profileApi } from "../../../../services/apis";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiConnector("GET", profileApi.INSTRUCTOR_DASHBOARD_API, null, {
          Authorization: `Bearer ${token}`,
        });
        console.log("response:", response);
        setData(response.data.courses || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Prepare data for charts
  const barChartData = data.map((course) => ({
    name: course.courseName,
    students: course.studentsEnrolled,
    amount: course.totalAmountGenerated,
  }));

  const pieChartData = data.map((course) => ({
    name: course.courseName,
    value: course.totalAmountGenerated,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#A4DE6C"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen lg:w-[1240px] mr-14 md:w-auto ">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Instructor Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Courses</h2>
          <p className="text-3xl font-bold text-blue-600">{data.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Students</h2>
          <p className="text-3xl font-bold text-green-600">
            {data.reduce((sum, course) => sum + course.studentsEnrolled, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-3xl font-bold text-purple-600">
            ₹{data.reduce((sum, course) => sum + course.totalAmountGenerated, 0)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart for Students Enrolled */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Students Enrolled per Course</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Revenue Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Revenue Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={180}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Course Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Course Name</th>
                <th className="px-4 py-2 text-left">Students Enrolled</th>
                <th className="px-4 py-2 text-left">Total Amount Generated</th>
              </tr>
            </thead>
            <tbody>
              {data.map((course) => (
                <tr key={course._id} className="border-t">
                  <td className="px-4 py-2">{course.courseName}</td>
                  <td className="px-4 py-2">{course.studentsEnrolled}</td>
                  <td className="px-4 py-2">₹{course.totalAmountGenerated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
