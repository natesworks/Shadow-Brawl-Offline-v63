import csv
import os
import re
from pathlib import Path

# Input and output directories
INPUT_DIRS = [
    "/Users/nabil/Documents/GitHub/Shadow-Brawl-Offline-v63/agent/Assets/csv_client",
    "/Users/nabil/Documents/GitHub/Shadow-Brawl-Offline-v63/agent/Assets/csv_logic"
]
OUTPUT_DIR = "Output/Assets"

NUM_WORDS = {
    "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
    "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine"
}

def pascal_case(s):
    """Convert string to PascalCase and remove invalid characters"""
    if not s:
        return "Row"
    s = re.sub(r'[^a-zA-Z0-9\s]', '', s)  # remove non-alphanumeric
    s = re.sub(r'[_\s]+', ' ', s)         # normalize spaces/underscores
    return ''.join(word.capitalize() for word in s.split() if word)

def fix_identifier(name):
    """Convert string to PascalCase and handle leading digits."""
    name = pascal_case(name)
    match = re.match(r'^(\d+)(.*)', name)
    if match:
        digits, rest = match.groups()
        word_digits = ''.join(NUM_WORDS[d] for d in digits)
        name = word_digits + rest
    if not name:
        name = "Row"
    return name

def csv_to_ts_class(csv_path, output_path):
    class_name = fix_identifier(csv_path.stem)
    ts_lines = [f"class {class_name} {{"]
    
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = list(csv.reader(csvfile))
        if len(reader) < 2:
            print(f"Skipping {csv_path}, not enough rows")
            return
        
        headers = reader[0]
        types = reader[1]

        data_rows = reader[2:]  # keep all rows, even empty
        generated_names = set()  # track all sub-class names

        for row_index, row in enumerate(data_rows, start=1):
            # Use first column as name, or Row+RowID if empty
            raw_name = row[0].strip() if len(row) > 0 and row[0].strip() else f"Row{row_index}"
            sub_class_name = fix_identifier(raw_name)

            # Ensure unique sub-class name
            original_name = sub_class_name
            counter = 1
            while sub_class_name in generated_names:
                sub_class_name = f"{original_name}{counter}"
                counter += 1
            generated_names.add(sub_class_name)
            
            ts_lines.append(f"    static {sub_class_name} = class {{")
            
            for i, header in enumerate(headers):
                if i >= len(row) or row[i].strip() == "":
                    continue
                value = row[i].strip()
                prop_name = fix_identifier(header)
                # Everything static now
                if types[i].lower() in ["int", "float", "boolean"]:
                    if types[i].lower() == "boolean":
                        value = value.lower() if value.lower() in ["true", "false"] else "false"
                    ts_lines.append(f"        static {prop_name} = {value}")
                else:
                    ts_lines.append(f'        static {prop_name} = "{value}"')
            
            # Always add RowID as static
            ts_lines.append(f"        static RowID = {row_index}")
            ts_lines.append("    }")
    
    ts_lines.append(f"}}\n\nexport default {class_name};")

    # Ensure output folder exists
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(ts_lines))
    print(f"Converted {csv_path} -> {output_path}")

def main():
    for input_dir in INPUT_DIRS:
        input_path_obj = Path(input_dir)
        if not input_path_obj.exists():
            print(f"Input directory does not exist: {input_dir}")
            continue
        print(f"Scanning directory: {input_dir}")
        
        for root, _, files in os.walk(input_path_obj):
            for file in files:
                if file.endswith(".csv"):
                    input_path = Path(root) / file
                    print(f"Found CSV: {input_path}")
                    
                    # PascalCase output filename
                    output_file_name = fix_identifier(input_path.stem) + ".ts"
                    output_dir = Path(OUTPUT_DIR) / Path(input_dir).name
                    output_path = output_dir / output_file_name
                    print(f"Will output to: {output_path}")
                    
                    csv_to_ts_class(input_path, output_path)

if __name__ == "__main__":
    main()
