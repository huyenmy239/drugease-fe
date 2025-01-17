const sidebarTemplates = {
    admin: `
        <div class="sidebar-body">
            <div class="logo">
                <img alt="logo system" src="/assets/images/logoblue.png" />
                <a href="employee.html"><span>drug management system</span></a>
            </div>

            <ul class="menu">
                <li class="no-hover section-header">REPORT MANAGEMENT</li>
                <li><a href="/pages/admin/reports/prescription.html">
                        <i class="fa-solid fa-prescription-bottle"></i>
                        Prescription
                    </a></li>
                <li><a href="/pages/admin/reports/warehouse.html">
                        <i class="fa-solid fa-warehouse"></i>
                        Warehouse
                    </a></li>
                <li><a href="/pages/admin/reports/performance.html">
                        <i class="fa-solid fa-chart-bar"></i>
                        Performance
                    </a></li>
                <li><a href="/pages/admin/reports/financial.html">
                        <i class="fa-solid fa-dollar-sign"></i>
                        Financial
                    </a></li>

                <li class="no-hover section-header">HUMAN MANAGEMENT</li>
                <li><a href="/pages/employee.html">
                        <i class="fa-solid fa-user-group"></i>
                        Employee
                    </a></li>
                <li><a href="/pages/admin/patient.html">
                        <i class="fa-solid fa-hospital-user"></i>
                        Patient
                    </a></li>

                <li class="no-hover section-header">RESOURCE MANAGEMENT</li>
                <li><a href="#">
                        <i class="fa-solid fa-pills"></i>
                        Medicine
                    </a></li>
                <li><a href="#">
                        <i class="fa-solid fa-warehouse"></i>
                        Warehouse
                    </a></li>
                <li><a href="#">
                        <i class="fa-solid fa-file-import"></i>
                        Import Receipt
                    </a></li>
                <li><a href="#">
                        <i class="fa-solid fa-file-export"></i>
                        Export Receipt
                    </a></li>

                <li class="no-hover section-header">TREATMENT MANAGEMENT</li>
                <li><a href="/pages/prescription.html">
                        <i class="fa-solid fa-file-waveform"></i>
                        Prescription
                    </a></li>

                <li class="no-hover section-header">INDIVIDUAL MANAGEMENT</li>
                <li><a href="/pages/profile.html">
                        <i class="fa-solid fa-circle-user"></i>
                        Profile
                    </a></li>
                <li><a href="pages/login.html">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        Log out
                    </a></li>

                
            </ul>
        </div>
    `,
    doctor: `
        <div class="sidebar-body">
            <div class="logo">
                <img alt="logo system" src="/assets/images/logoblue.png" />
                <a href="employee.html"><span>drug management system</span></a>
            </div>

            <ul class="menu">
                <li class="no-hover section-header">TREATMENT MANAGEMENT</li>
                <li><a href="prescription.html">
                        <i class="fa-solid fa-file-waveform"></i>
                        Prescription
                    </a></li>

                <li class="no-hover section-header">INDIVIDUAL MANAGEMENT</li>
                <li><a href="profile.html">
                        <i class="fa-solid fa-circle-user"></i>
                        Profile
                    </a></li>
                <li><a href="#">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        Log out
                    </a></li>
            </ul>
        </div>
    `,
    pharmacist: `
        <div class="sidebar-body">
            <div class="logo">
                <img alt="logo system" src="/assets/images/logoblue.png" />
                <a href="employee.html"><span>drug management system</span></a>
            </div>

            <ul class="menu">
                <li class="no-hover section-header">RESOURCE MANAGEMENT</li>
                <li><a href="#">
                        <i class="fa-solid fa-file-export"></i>
                        Export Receipt
                    </a></li>

                <li class="no-hover section-header">INDIVIDUAL MANAGEMENT</li>
                <li><a href="profile.html">
                        <i class="fa-solid fa-circle-user"></i>
                        Profile
                    </a></li>
                <li><a href="#">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        Log out
                    </a></li>
            </ul>
        </div>
    `,
    staff: `
        <div class="sidebar-body">
            <div class="logo">
                <img alt="logo system" src="/assets/images/logoblue.png" />
                <a href="employee.html"><span>drug management system</span></a>
            </div>

            <ul class="menu">
                <li class="no-hover section-header">HUMAN MANAGEMENT</li>
                <li><a href="/pages/staff/patient.html">
                        <i class="fa-solid fa-hospital-user"></i>
                        Patient
                    </a></li>

                <li class="no-hover section-header">RESOURCE MANAGEMENT</li>
                <li><a href="/pages/staff/medicine.html">
                        <i class="fa-solid fa-pills"></i>
                        Medicine
                    </a></li>
                <li><a href="/pages/staff/warehouse.html">
                        <i class="fa-solid fa-warehouse"></i>
                        Warehouse
                    </a></li>
                <li><a href="#">
                        <i class="fa-solid fa-file-import"></i>
                        Import Receipt
                    </a></li>

                <li class="no-hover section-header">INDIVIDUAL MANAGEMENT</li>
                <li><a href="profile.html">
                        <i class="fa-solid fa-circle-user"></i>
                        Profile
                    </a></li>
                <li><a href="#">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        Log out
                    </a></li>
            </ul>
        </div>
    `,
};



function loadComponent(selector) {
    const userRole = localStorage.getItem('role');

    if (!userRole || !sidebarTemplates[userRole]) {
        console.warn('Role not found or unauthorized. Redirecting to login.');
        window.location.href = 'login.html';
        return;
    }

    const container = document.querySelector(selector);
    container.innerHTML = sidebarTemplates[userRole];

    document.querySelector('.fa-arrow-right-from-bracket').closest('a').addEventListener('click', function (event) {
        event.preventDefault();
        logout();
    });

    // setupSidebarEvents();
}

function logout() {
    localStorage.clear();
    window.location.href = '/pages/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('#sidebar-placeholder');
});
