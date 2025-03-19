from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
import os
import google.generativeai as genai

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        text = ''.join([page.extract_text() or '' for page in reader.pages])
        return text
    except Exception as e:
        return f"Erreur d'extraction du texte du PDF : {str(e)}"

@app.route('/')
def index():
    return "Hello, welcome to the CV analysis API!"

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.form.get('content', '')
    pdf_file = request.files.get('pdf_file')

    cv_text = ""
    if pdf_file and allowed_file(pdf_file.filename):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], pdf_file.filename)
        pdf_file.save(file_path)
        cv_text = extract_text_from_pdf(file_path)
        os.remove(file_path)  

    prompt = f"Analysez le CV suivant et fournissez des conseils personnalisés : {cv_text}. Message de l'utilisateur : {user_message}" if cv_text else user_message

    API_KEY = os.environ.get('GEMINI_API_KEY')
    if not API_KEY:
        return jsonify({'error': "GEMINI_API_KEY non définie."}), 500

    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')

    try:
        response = model.generate_content(prompt)
        return jsonify({'response': response.text})
    except Exception as e:
        return jsonify({'error': f"Erreur de génération : {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
