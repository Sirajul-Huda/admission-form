import React, { useState } from 'react';

const AdmissionForm = () => {
	const [selectedInstitution, setSelectedInstitution] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({});

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
	];

	const fieldsDict = { name: '', title: '', type: '', required: false }

	const [formFields, setFormFields] = useState([]);

	const handleInstitutionSelect = async (e) => {
		console.log('Selected institution:', e.target.value);
		const selectedValue = e.target.value;
		if (selectedValue) {
			setSelectedInstitution(e.target.value);
		}
		else {
			console.log("Please select an institution");
		}
		try {
			console.log("here")
			const response = await fetch('https://api.sirajulhuda.com/api/v1/erp/admission-application-config/22', {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				},
			});
			console.log("here2")
			const res = await response.json();
			const institutionFormDetails = res["data"];
			const institutionFormConfigs = institutionFormDetails['config'];
			const fieldtypes = ["str", "standard", "school", "ration_card_type", "yes_no", "local_body"];

			const updatedFormFields = institutionFormConfigs.filter(config => config.visibility === true).map(config => ({
				...fieldsDict,
				name: config.name,
				title: config.title,
				type:  fieldtypes.includes(config.type) ? 'text' 	: config.type === 'int' ? 'number' : config.type,

				required: config.required
			}));
			setFormFields(updatedFormFields);
			console.log("InstitutionFormDetails:", updatedFormFields);

		}
		catch (error) {
			console.error("Error d:", error);
			alert("Something went wrong. Please try again.");
		}
		setShowForm(true);
	}

	const handleBack = () => {
		setShowForm(false);
		setSelectedInstitution('');
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Form submitted:', { institution: selectedInstitution, ...formData });
	};

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
										Selected: {institutions.find(i => i.id === Number(selectedInstitution))?.id}
									</p>
								</div>

								<div className="form-fields">
									{formFields.length === 0 ? (
										<p className="no-fields">loading</p>
									) : (
										formFields.map((field) => (
											<div key={field.name} className="form-field">
												<label htmlFor={field.name} className="field-label">
													{field.title}
													{field.required && <span className="required">*</span>}
												</label>
												<input
													type={field.type}
													id={field.name}
													name={field.name}
													required={field.required}
													placeholder={`Enter ${field.title}`}
													value={formData[field.name] || ''}
													onChange={handleChange}
													className="field-input"
												/>
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
}
export default AdmissionForm;