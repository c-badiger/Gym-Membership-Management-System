// Mock Data
const members = [
  { id: 1, name: 'Alice Cooper', email: 'alice@example.com', phone: '555-0100', status: 'Active', payment: 'Paid' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '555-0101', status: 'Inactive', payment: 'Unpaid' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', phone: '555-0102', status: 'Active', payment: 'Paid' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '555-0103', status: 'Active', payment: 'Unpaid' },
];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function renderMembers() {
  const membersList = document.getElementById('membersList');
  membersList.innerHTML = '';

  members.forEach(member => {
    const row = document.createElement('div');
    row.className = 'member-row';

    const statusClass = member.status === 'Active' ? 'badge-active' : 'badge-inactive';
    const paymentClass = member.payment === 'Paid' ? 'badge-paid' : 'badge-unpaid';

    row.innerHTML = `
      <div class="member-info">
        <div class="member-avatar">${getInitials(member.name)}</div>
        <div class="member-details">
          <span class="member-name">${member.name}</span>
          <span class="member-email">${member.email}</span>
        </div>
      </div>
      <div class="member-phone">${member.phone}</div>
      <div><span class="badge ${statusClass}">${member.status}</span></div>
      <div><span class="badge ${paymentClass}">${member.payment}</span></div>
      <div class="member-actions">
        <button class="btn-icon edit" onclick="editMember(${member.id})" title="Edit"><i class="fas fa-edit"></i></button>
        <button class="btn-icon delete" onclick="deleteMember(${member.id})" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    `;

    membersList.appendChild(row);
  });
}

function editMember(id) {
  const member = members.find(m => m.id === id);
  if(member) {
    document.getElementById('name').value = member.name;
    document.getElementById('email').value = member.email;
    document.getElementById('phone').value = member.phone;
    document.getElementById('status').value = member.status;
    document.getElementById('payment').value = member.payment;
    
    document.getElementById('formTitle').textContent = 'Edit Member';
    document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth' });
  }
}

function deleteMember(id) {
  if(confirm('Are you sure you want to delete this member?')) {
    const index = members.findIndex(m => m.id === id);
    if(index > -1) {
      members.splice(index, 1);
      renderMembers();
    }
  }
}

document.getElementById('memberForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const status = document.getElementById('status').value;
  const payment = document.getElementById('payment').value;

  const btn = e.target.querySelector('button');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';

  // Simulate network request
  setTimeout(() => {
    // Determine if edit or add
    const title = document.getElementById('formTitle').textContent;
    if(title === 'Edit Member') {
      // Find existing member by email/name for mock update
      const existing = members.find(m => m.name === name || m.email === email);
      if(existing) {
        existing.name = name;
        existing.email = email;
        existing.phone = phone;
        existing.status = status;
        existing.payment = payment;
      }
    } else {
      members.unshift({
        id: Date.now(),
        name,
        email,
        phone,
        status,
        payment
      });
    }

    renderMembers();
    this.reset();
    document.getElementById('formTitle').textContent = 'Add Member';
    btn.innerHTML = originalText;
    
    // Smooth scroll back to list on mobile
    if(window.innerWidth <= 1024) {
       document.querySelector('.members-list-panel').scrollIntoView({ behavior: 'smooth' });
    }
  }, 600);
});

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
  renderMembers();
});
