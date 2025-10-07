// Sample attendance data
let attendanceData = [
  { name: 'Ahmad Bin Ali', cardId: 'A001234', time: '07:15:30', date: '2025-10-07', status: 'hadir' },
  { name: 'Siti Nurhaliza', cardId: 'A001235', time: '07:45:12', date: '2025-10-07', status: 'lewat' },
  { name: 'Muhammad Hakim', cardId: 'A001236', time: '07:10:45', date: '2025-10-07', status: 'hadir' },
  { name: 'Nurul Aina', cardId: 'A001237', time: '07:55:20', date: '2025-10-07', status: 'lewat' },
  { name: 'Amir Hafiz', cardId: 'A001238', time: '07:05:33', date: '2025-10-07', status: 'hadir' },
  { name: 'Fatimah Zahra', cardId: 'A001239', time: '07:20:15', date: '2025-10-07', status: 'hadir' },
  { name: 'Zulkifli Ibrahim', cardId: 'A001240', time: '08:00:05', date: '2025-10-07', status: 'lewat' },
  { name: 'Aishah Hani', cardId: 'A001241', time: '07:12:40', date: '2025-10-07', status: 'hadir' },
  { name: 'Hafiz Rahman', cardId: 'A001242', time: '07:30:22', date: '2025-10-06', status: 'hadir' },
  { name: 'Nadia Sofea', cardId: 'A001243', time: '07:48:18', date: '2025-10-06', status: 'lewat' },
];

let filteredData = [...attendanceData];

function loadAttendanceData() {
  const tbody = document.getElementById('attendanceBody');
  
  if (filteredData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">Tiada rekod kehadiran dijumpai</td></tr>';
    updateStats();
    return;
  }

  tbody.innerHTML = filteredData.map((record, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${record.name}</strong></td>
      <td>${record.cardId}</td>
      <td class="time-cell">${record.time}</td>
      <td>${formatDate(record.date)}</td>
      <td>
        <span class="status-badge status-${record.status}">
          ${record.status === 'hadir' ? '✓ Hadir' : '⚠ Lewat'}
        </span>
      </td>
    </tr>
  `).join('');

  updateStats();
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
  
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function updateStats() {
  const today = new Date().toISOString().split('T')[0];
  const todayData = filteredData.filter(r => r.date === today);
  
  document.getElementById('total-today').textContent = todayData.length;
  document.getElementById('total-hadir').textContent = todayData.filter(r => r.status === 'hadir').length;
  document.getElementById('total-lewat').textContent = todayData.filter(r => r.status === 'lewat').length;
}

function filterData() {
  const dateFilter = document.getElementById('filterDate').value;
  const statusFilter = document.getElementById('filterStatus').value;
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  filteredData = attendanceData.filter(record => {
    // Date filter
    const recordDate = new Date(record.date);
    const today = new Date();
    let dateMatch = true;

    if (dateFilter === 'today') {
      dateMatch = record.date === today.toISOString().split('T')[0];
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateMatch = recordDate >= weekAgo;
    } else if (dateFilter === 'month') {
      dateMatch = recordDate.getMonth() === today.getMonth() && 
                 recordDate.getFullYear() === today.getFullYear();
    }

    // Status filter
    const statusMatch = statusFilter === 'all' || record.status === statusFilter;

    // Search filter
    const searchMatch = record.name.toLowerCase().includes(searchTerm) || 
                      record.cardId.toLowerCase().includes(searchTerm);

    return dateMatch && statusMatch && searchMatch;
  });

  loadAttendanceData();
}

function refreshData() {
  // Simulate adding new random record
  const names = ['Ali Ahmad', 'Sarah Lee', 'Hassan Yusof', 'Mira Sofea', 'Zain Malik'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const status = Math.random() > 0.5 ? 'hadir' : 'lewat';
  
  const newRecord = {
    name: randomName,
    cardId: 'A00' + Math.floor(1000 + Math.random() * 9000),
    time: timeStr,
    date: now.toISOString().split('T')[0],
    status: status
  };

  attendanceData.unshift(newRecord);
  filterData();
  
  // Visual feedback
  const btn = event.target;
  btn.textContent = '✓ Dikemaskini';
  setTimeout(() => {
    btn.textContent = '🔄 Refresh';
  }, 2000);
}

function exportData() {
  // Create CSV content
  let csv = 'Bil,Nama,ID Kad,Masa,Tarikh,Status\n';
  
  filteredData.forEach((record, index) => {
    csv += `${index + 1},"${record.name}",${record.cardId},${record.time},${record.date},${record.status}\n`;
  });

  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kehadiran_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', filterData);
  }
  
  // Initial load
  loadAttendanceData();
});