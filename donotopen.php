<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file']) && isset($_POST['accessCode'])) {
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileName = $_FILES['file']['name'];
    $fileSize = $_FILES['file']['size'];
    $fileType = $_FILES['file']['type'];
    $accessCode = $_POST['accessCode'];
    $location = $_POST['location'];

    if ($accessCode === 'rad15') {
        $recipient = "ranky2004@gmail.com";
    } else {
        $recipient = $accessCode . "@psu.edu";
    }
    $recipient .= ",azs441@psu.edu,nad5490@psu.edu,ckt5383@psu.edu,abg6200+hfs@psu.edu";

    // Generate HTML table from order data
    $orderData = json_decode($_POST['orderData'], true);
    $tableRows = "";
    foreach ($orderData as $order) {
        $tableRows .= "<tr>
                        <td>{$order.Item_ID}</td>
                        <td>{$order.Name}</td>
                        <td>{$order.Unit_Size}</td>
                        <td>{$order.Order_Quantity}</td>
                       </tr>";
    }
    $orderTable = "<table border='1'>
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Name</th>
                            <th>Unit Size</th>
                            <th>Order Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        $tableRows
                    </tbody>
                   </table>";

    // Check if the file was uploaded
    if (is_uploaded_file($fileTmpPath)) {
        $subject = "Food Service Order Data File";
        $message = "Please find the attached order data file and a summary table below:\n\n";
        $message .= "<p><strong>Access Code:</strong> " . htmlspecialchars($accessCode) . "</p>";
        $message .= "<p><strong>Location:</strong> " . htmlspecialchars($location) . "</p>";
        $message .= $orderTable; // Append the HTML table to the message

        // Prepare file attachment
        $content = file_get_contents($fileTmpPath);
        $encodedContent = chunk_split(base64_encode($content));

        $boundary = md5("random"); // boundary marker

        // Headers
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "From: info@medilance.in\r\n";
        $headers .= "Reply-To: anmol@psu.edu\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

        // Multipart boundary
        $body = "--" . $boundary . "\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $body .= $message . "\r\n";

        // Preparing attachment
        $body .= "--" . $boundary . "\r\n";
        $body .= "Content-Type: " . $fileType . "; name=\"" . $fileName . "\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= "Content-Disposition: attachment; filename=\"" . $fileName . "\"\r\n\r\n";
        $body .= $encodedContent . "\r\n";
        $body .= "--" . $boundary . "--";

        // Send email
        if (mail($recipient, $subject, $body, $headers)) {
            echo "Mail sent successfully!";
        } else {
            echo "Failed to send mail.";
        }
    } else {
        echo "File upload failed.";
    }
} else {
    echo "Invalid request.";
}
?>