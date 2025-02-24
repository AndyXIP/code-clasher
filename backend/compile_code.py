import subprocess
import os

# Function to compile and run Python code
def run_python(code):
    filename = "temp_code.py"

    # Write the Python code to a temporary file
    with open(filename, "w") as f:
        f.write(code)
    
    try:
        result = subprocess.run(["python3", filename], capture_output=True, text=True)
        return result.stdout, result.stderr
    except Exception as e:
        return f"Error: {str(e)}", ""
    finally:
        if os.path.exists(filename):
            os.remove(filename)  # Clean up Python file

# Function to compile and run C++ code
def run_cpp(code):
    cpp_filename = "temp_code.cpp"
    executable = "temp_code"

    with open(cpp_filename, "w") as f:
        f.write(code)
    
    try:
        # Compile C++ code
        subprocess.run(["g++", cpp_filename, "-o", executable], check=True)

        # Run the compiled binary
        result = subprocess.run(["./" + executable], capture_output=True, text=True)
        return result.stdout, result.stderr
    except subprocess.CalledProcessError as e:
        return f"Compilation Error: {e.stderr}", ""
    except Exception as e:
        return f"Error: {str(e)}", ""
    finally:
        # Clean up temporary files
        if os.path.exists(cpp_filename):
            os.remove(cpp_filename)
        if os.path.exists(executable):
            os.remove(executable)

# Function to compile and run Java code
def run_java(code):
    java_filename = "Test.java"  # Ensure the filename matches the Java class name
    class_filename = "Test.class"

    with open(java_filename, "w") as f:
        f.write(code)
    
    try:
        # Compile Java code
        subprocess.run(["javac", java_filename], check=True)

        # Run the compiled Java program
        result = subprocess.run(["java", "Test"], capture_output=True, text=True)
        return result.stdout, result.stderr
    except subprocess.CalledProcessError as e:
        return f"Compilation Error: {e.stderr}", ""
    except Exception as e:
        return f"Error: {str(e)}", ""
    finally:
        # Clean up temporary files
        if os.path.exists(java_filename):
            os.remove(java_filename)
        if os.path.exists(class_filename):
            os.remove(class_filename)

# Central function to call the appropriate language function
def compile_code(language, code):
    if language == 'python':
        return run_python(code)
    elif language == 'cpp':
        return run_cpp(code)
    elif language == 'java':
        return run_java(code)
    else:
        return "Unsupported language", ""
