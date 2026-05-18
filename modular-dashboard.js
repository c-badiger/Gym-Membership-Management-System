document.addEventListener('DOMContentLoaded', () => {
  // Members Data
  const members = [
    { id: 1, name: 'Alex Johnson', phone: '555-0123', status: 'Active', payment: 'Paid' },
    { id: 2, name: 'Sarah Williams', phone: '555-0124', status: 'Active', payment: 'Unpaid' },
    { id: 3, name: 'Mike Brown', phone: '555-0125', status: 'Inactive', payment: 'Unpaid' },
    { id: 4, name: 'Emily Davis', phone: '555-0126', status: 'Active', payment: 'Paid' },
    { id: 5, name: 'David Wilson', phone: '555-0127', status: 'Active', payment: 'Paid' }
  ];

  // Payments Data
  const payments = [
    { id: 101, name: 'Alex Johnson', amount: '$49.00', date: 'Oct 24, 2026', status: 'Paid' },
    { id: 102, name: 'Sarah Williams', amount: '$89.00', date: 'Oct 23, 2026', status: 'Unpaid' },
    { id: 103, name: 'Emily Davis', amount: '$49.00', date: 'Oct 22, 2026', status: 'Paid' },
    { id: 104, name: 'David Wilson', amount: '$29.00', date: 'Oct 20, 2026', status: 'Paid' }
  ];

  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  function getStatusBadge(status) {
    if (status === 'Active') return '<span class="badge badge-success">Active</span>';
    if (status === 'Inactive') return '<span class="badge badge-neutral">Inactive</span>';
    return `<span class="badge badge-neutral">${status}</span>`;
  }

  function getPaymentBadge(status) {
    if (status === 'Paid') return '<span class="badge badge-primary">Paid</span>';
    if (status === 'Unpaid') return '<span class="badge badge-danger">Unpaid</span>';
    return `<span class="badge badge-warning">${status}</span>`;
  }

  // Render Members Table
  function renderMembers() {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';

    members.forEach(member => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="member-cell">
            <div class="member-avatar-sm">${getInitials(member.name)}</div>
            ${member.name}
          </div>
        </td>
        <td>${member.phone}</td>
        <td>${getStatusBadge(member.status)}</td>
        <td>${getPaymentBadge(member.payment)}</td>
        <td>
          <button class="btn-icon edit" onclick="editMember(${member.id})" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon delete" onclick="deleteMember(${member.id})" title="Delete"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Render Payments Table
  function renderPayments() {
    const tbody = document.getElementById('paymentsTableBody');
    tbody.innerHTML = '';

    payments.forEach(payment => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="member-cell">
            <div class="member-avatar-sm">${getInitials(payment.name)}</div>
            ${payment.name}
          </div>
        </td>
        <td><strong>${payment.amount}</strong></td>
        <td><span style="color: var(--text-muted); font-size: 13px;">${payment.date}</span></td>
        <td>${getPaymentBadge(payment.status)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Form Submission
  document.getElementById('memberForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const name = document.getElementById('memberName').value;
    const phone = document.getElementById('memberPhone').value;
    const status = document.getElementById('memberStatus').value;
    const payment = document.getElementById('memberPayment').value;

    setTimeout(() => {
      members.unshift({
        id: Date.now(),
        name,
        phone,
        status,
        payment
      });
      renderMembers();
      this.reset();
      btn.innerHTML = originalText;
    }, 500);
  });

  // Global functions for inline handlers
  window.editMember = function(id) {
    const member = members.find(m => m.id === id);
    if(member) {
      document.getElementById('memberName').value = member.name;
      document.getElementById('memberPhone').value = member.phone;
      document.getElementById('memberStatus').value = member.status;
      document.getElementById('memberPayment').value = member.payment;
      
      const formModule = document.querySelector('.form-module');
      formModule.scrollIntoView({ behavior: 'smooth', block: 'center' });
      formModule.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.3)';
      setTimeout(() => { formModule.style.boxShadow = ''; }, 1500);
    }
  };

  window.deleteMember = function(id) {
    if(confirm('Delete this member?')) {
      const index = members.findIndex(m => m.id === id);
      if(index > -1) {
        members.splice(index, 1);
        renderMembers();
      }
    }
  };

  // Initial Render
  renderMembers();
  renderPayments();
});
