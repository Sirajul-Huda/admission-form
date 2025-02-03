import React, { useState } from 'react';

const AdmissionForm = () => {
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [formFields, setFormFields] = useState([]);

  const institutions = [
		{
			"id": 3,
			"name": "rfrt"
		},
		{
			"id": 7,
			"name": "Thazkiyathul Anam Educational Complex, Shivapuram"	
		},
		{
			"id": 9,
			"name": "Sirajul Huda Arts College Test"
		},
		{
			"id": 14,
			"name": "College of Integrated Studies"
		},
		{
			"id": 15,
			"name": "Marrkazul Huda College of Integrated Studies, Irungannur"
		},
		{
			"id": 16,
			"name": "Darul Huda Educational Complex Nadapuram"
		},
		{
			"id": 18,
			"name": "Sirajul Huda College of Integrated Studies, Thuvakkunnu"
		},
		{
			"id": 24,
			"name": "test"
		},
		{
			"id": 36,
			"name": "Samyukta Mahall Committee Office"
		},
		{
			"id": 42,
			"name": "Hayat Professionals' Abode"
		},
		{
			"id": 23,
			"name": "Ecole International Prep - School"
		},
		{
			"id": 27,
			"name": "Q - Garden"
		},
		{
			"id": 11,
			"name": "Darul Huda English Medium School Nadapuram"
		},
		{
			"id": 6,
			"name": "Sirajul Huda Women's Academy, Kainatty"
		},
		{
			"id": 34,
			"name": "Sirajul Huda Central Office"
		},
		{
			"id": 8,
			"name": "College of Quran and Integrated Studies"
		},
		{
			"id": 33,
			"name": "Sirajul Huda College of Sharia and Arabic"
		},
		{
			"id": 30,
			"name": "Sirajul Huda School of Excellence Parakkadavu"
		},
		{
			"id": 4,
			"name": "Sirajul Huda English Medium School, Perambra"
		},
		{
			"id": 28,
			"name": "Sirajul Huda English Medium School Vatakara"
		},
		{
			"id": 20,
			"name": "Darul Huda Arts & Science College Nadapuram"
		},
		{
			"id": 35,
			"name": "Mishkathul Huda Educational Complex, Maniyur"
		},
		{
			"id": 21,
			"name": "College of Science and Integrated Studies"
		},
		{
			"id": 5,
			"name": "Sirajul Huda Women's Academy, Nadapuram"
		},
		{
			"id": 45,
			"name": "Darul Huda Educational Complex Nadapuram"
		},
		{
			"id": 44,
			"name": "Smart Charitable Trust, Wayanad"
		},
		{
			"id": 19,
			"name": "Sirajul Huda Orphan Care"
		},
		{
			"id": 43,
			"name": "Sirajul Huda Hiflul Quran College, Nadapuram"
		},
		{
			"id": 25,
			"name": "Jamia Sirajul Huda"
		},
		{
			"id": 32,
			"name": "Sirajul Huda Kuttiady"
		},
		{
			"id": 31,
			"name": "School of Tahfizul Quran"
		},
		{
			"id": 41,
			"name": "Womens Academy"
		},
		{
			"id": 10,
			"name": "Sirajul Huda Institute of Management Studies"
		},
		{
			"id": 46,
			"name": "Darul Huda Higher Secondary School Nadapuram"
		},
		{
			"id": 26,
			"name": "Sirajul Huda English Medium School Test"
		},
		{
			"id": 38,
			"name": "Sirajul Huda English Medium School Peringathur"
		},
		{
			"id": 12,
			"name": "Sirajul Huda English Medium School Kuttiadi"
		},
		{
			"id": 37,
			"name": "Sirajul Huda English Medium School Meppayur"
		},
		{
			"id": 29,
			"name": "Sirajul Huda Educational Complex"
		},
		{
			"id": 17,
			"name": "Sirajul Huda Women's Academy, Parakkadavu"
		},
		{
			"id": 40,
			"name": "Sirajul Huda School of Excellence Kuttiady"
		},
		{
			"id": 39,
			"name": "College of Integrated Studies, Kuttiady"
		},
		{
			"id": 13,
			"name": "Sirajul Huda Women's Academy, Kuttiadi"
		},
		{
			"id": 22,
			"name": "Darul Hudda English Medium School Parakkadavu"
		},
		{
			"id": 47,
			"name": "Darul Huda Educational Complex, Nadapuram"
		},
		{
			"id": 49,
			"name": "Ecole International Secondary School"
		},
		{
			"id": 48,
			"name": "Sirajul Huda Hiflul Quran College Nadapuram"	
		}
	]
	

  const handleInstitutionSelect = async (e) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      setSelectedInstitution(selectedValue);
      try {
				console.log(selectedValue);
        const response = await fetch(`https://api.sirajulhuda.com/api/v1/erp/admission-application-config/${selectedValue}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });
        
        const res = await response.json();
        const institutionFormDetails = res.data;
        const institutionFormConfigs = institutionFormDetails.config;

        // Updated field types mapping with number fields
        const fieldTypes = {
          str: 'text',
          standard: 'text',
          school: 'text',
          ration_card_type: 'text',
          yes_no: 'checkbox',
          local_body: 'text',
          int: 'number',
          date: 'date'
        };

        // Number-specific fields that should always be number type
        const numberFields = [
          'mobile',
          'whats_app',
          'aadhaar',
          'phone',
          'father_phone',
          'mother_phone',
          'pin_code'
        ];

        const updatedFormFields = institutionFormConfigs
          .filter(config => config.visibility === true)
          .map(config => ({
            name: config.column_name,
            title: config.title,
            type: numberFields.includes(config.column_name) ? 'number' : fieldTypes[config.type] || 'text',
            required: config.is_required,
            defaultValue: config.default_value
          }));

        setFormFields(updatedFormFields);
        
        const initialFormData = {};
        updatedFormFields.forEach(field => {
          if (field.defaultValue !== null) {
            initialFormData[field.name] = field.defaultValue;
          }
        });
        setFormData(initialFormData);

      } catch (error) {
        console.error("Error fetching form config:", error);
        alert("Something went wrong. Please try again.");
      }
    }
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedInstitution('');
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      institution_id: selectedInstitution,
      ...formData
    };

		try {
			const url = 'https://64b7-117-206-36-47.ngrok-free.app/api/v1/erp/admission/application/submit';
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test",
        },
        body: JSON.stringify(
					submissionData
				),
      });



    console.log('Form submitted with the following data:', submissionData);
    console.log('\nDetailed Form Submission:');
    Object.entries(submissionData).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  } catch (error) {
		console.error("Error submitting form:", error);
	}
	}
  return (
    <div className="admission-page">
      <div className="form-container">
        <div className="form-wrapper">
          <div className="form-card">
            <h2 className="form-title">Application for Admission</h2>

            {!showForm ? (
              <div className="institution-select">
                <label htmlFor="institution" className="select-label">
                  Select Institution
                </label>
                <select
                  id="institution"
                  value={selectedInstitution}
                  onChange={handleInstitutionSelect}
                  className="select-input"
                >
                  <option value="">Choose an institution</option>
                  {institutions.map((inst) => (
                    <option key={inst.id} value={String(inst.id)}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="admission-form">
                <div className="form-header">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="back-button"
                  >
                    ← Back
                  </button>
                  <p className="selected-institution">
                    Selected: {institutions.find(i => i.id === Number(selectedInstitution))?.name}
                  </p>
                </div>

                <div className="form-fields">
                  {formFields.length === 0 ? (
                    <p className="no-fields">Loading...</p>
                  ) : (
                    formFields.map((field) => (
                      <div key={field.name} className="form-field">
                        <label htmlFor={field.name} className="field-label">
                          {field.title}
                          {field.required && <span className="required">*</span>}
                        </label>
                        {field.type === 'checkbox' ? (
                          <input
                            type="checkbox"
                            id={field.name}
                            name={field.name}
                            checked={formData[field.name] || false}
                            onChange={handleChange}
                            className="checkbox-input"
                          />
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className="field-input"
                            placeholder={`Enter ${field.title}`}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <button type="submit" className="submit-button">
                  Submit Application →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
	
};

export default AdmissionForm;

// id: Optional[int] = None
// year_id: Optional[int] = None
// institution_id: Optional[int] = None
// standard_id: Optional[int] = None
// sem_id: Optional[int] = None
// batch_id: Optional[int] = None
// course_id: Optional[int] = None
// type: Optional[str] = None
// fb_id: Optional[str] = None
// applied_at: Optional[str] = None
// updated_at: Optional[str] = None
// mobile: Optional[str] = None
// whats_app: Optional[str] = None
// email: Optional[str] = None
// name: Optional[str] = None
// full_initial: Optional[str] = None
// dob: Optional[datetime] = None
// word_dob: Optional[str] = None
// gender: Optional[str] = None
// blood_group: Optional[str] = None
// religion: Optional[str] = None
// caste: Optional[str] = None
// aadhaar: Optional[str] = None
// mother_tongue: Optional[str] = None
// house_name: Optional[str] = None
// local_name: Optional[str] = None
// local_body: Optional[str] = None
// ration_card_type: Optional[str] = None
// pin_code: Optional[str] = None
// post: Optional[str] = None
// place: Optional[str] = None
// block: Optional[str] = None
// taluk: Optional[str] = None
// district: Optional[str] = None
// state: Optional[str] = None
// nationality: Optional[str] = None
// vaccination_date: Optional[datetime] = None
// is_single_girl: Optional[bool] = None
// is_disabled: Optional[bool] = None
// father_name: Optional[str] = None
// father_phone: Optional[str] = None
// father_income: Optional[str] = None
// father_email: Optional[str] = None
// father_qualification: Optional[str] = None
// father_occupation: Optional[str] = None
// mother_name: Optional[str] = None
// mother_occupation: Optional[str] = None
// mother_email: Optional[str] = None
// mother_phone: Optional[str] = None
// mother_qualification: Optional[str] = None
// mother_income: Optional[str] = None
// guardian: Optional[str] = None
// relationship: Optional[str] = None
// guardian_address: Optional[str] = None
// fb_year_id: Optional[str] = None
// fb_school_id: Optional[str] = None
// fb_cls_id: Optional[str] = None
// last_school: Optional[str] = None
// last_school_affiliation: Optional[str] = None
// tc_no: Optional[str] = None
// tc_issue_date: Optional[str] = None
// last_result: Optional[str] = None
// id_mark: Optional[str] = None
// birth_url: Optional[str] = None
// ration_url: Optional[str] = None
// aadhaar_url: Optional[str] = None
// ml_name: Optional[str] = None
// applied_by: Optional[str] = None
// img_url: Optional[str] = None
// panchayat: Optional[str] = None
// father_job_title: Optional[str] = None
// father_job_country: Optional[str] = None
// moral_education: Optional[str] = None
// academic_education: Optional[str] = None
// nominee_1: Optional[str] = None
// nominee_2: Optional[str] = None
// has_chronic: Optional[str] = None
// created_at: Optional[datetime] = None
// status: Optional[str] = None
// cap_id: Optional[str] = None
// married: Optional[bool] = None
// mark: Optional[dict] = None
// ssls_mark: Optional[dict] = None
// plus_two_mark: Optional[dict] = None
// degree_mark: Optional[dict] = None
// test_mark: Optional[dict] = None
// achievements: Optional[str] = None
// ugc_college: Optional[str] = None
// course_choice: Optional[str] = None
// ielts_choice: Optional[str] = None
// diploma_choice: Optional[str] = None
// responsible_1: Optional[str] = None
// responsible_2: Optional[str] = None