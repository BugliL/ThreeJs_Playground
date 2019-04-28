function createPiece(pieceData) {
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true });
    const createFunction = {
        'PIPE': createCylinder,
        'ELBOW': createElbow
    }
    return createFunction[pieceData.type](pieceData, material)

    function createElbow(elbowData, material) {
        let curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(elbowData.points.Px.x, elbowData.points.Px.y, elbowData.points.Px.z),
            new THREE.Vector3(elbowData.points.CP.x, elbowData.points.CP.y, elbowData.points.CP.z),
            new THREE.Vector3(elbowData.points.Py.x, elbowData.points.Py.y, elbowData.points.Py.z)
        );
        //TubeGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)
        //path - Curve - A path that inherits from the Curve base class
        //tubularSegments - Integer - The number of segments that make up the tube, default is 64
        //radius - Float - The radius of the tube, default is 1
        //radialSegments - Integer - The number of segments that make up the cross-section, default is 8
        //closed - Boolean Is the tube open or closed, default is false
        let geometry = new THREE.TubeGeometry(curve, 20, elbowData.section, 8, false);
        return new THREE.Mesh(geometry, material);
    }

    function createCylinder(cylinderData, material) {
        let points = cylinderData.points;
        let vector = new THREE.Vector3(
            points.Py.x - points.Px.x,
            points.Py.y - points.Px.y,
            points.Py.z - points.Px.z
        );

        let M = cylinderData.points.M;
        let middlePosition = new THREE.Vector3(M.x, M.y, M.z);

        //CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
        //radiusTop - Radius of the cylinder at the top. Default is 1.
        //radiusBottom - Radius of the cylinder at the bottom. Default is 1.
        //height - Height of the cylinder. Default is 1.
        //radialSegments - Number of segmented faces around the circumference of the cylinder. Default is 8
        //heightSegments - Number of rows of faces along the height of the cylinder. Default is 1.
        //openEnded - A Boolean indicating whether the ends of the cylinder are open or capped. Default is false, meaning capped.
        //thetaStart - Start angle for first segment, default = 0 (three o'clock position).
        //thetaLength - The central angle, often called theta, of the circular sector. The default is 2*Pi, which makes for a complete cylinder.
        let cylinderGeometry = new THREE.CylinderGeometry(
            cylinderData.section,
            cylinderData.section,
            cylinderData.length,
            15, 1, true
        );

        var axis = new THREE.Vector3(0, 1, 0);
        let cylinder = new THREE.Mesh(cylinderGeometry, material);
        cylinder.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
        cylinder.position.copy(middlePosition.clone());
        return cylinder;
    }
}
