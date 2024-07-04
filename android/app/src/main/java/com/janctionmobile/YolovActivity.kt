package com.janctionmobile

import android.app.Activity
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.GridLayout
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import java.util.*
import kotlin.concurrent.thread
import com.tencent.yolov5ncnn.ScreenUtils
import com.tencent.yolov5ncnn.AssetImageLoader
import com.tencent.yolov5ncnn.YoloV5Ncnn
import androidx.recyclerview.widget.RecyclerView
import androidx.recyclerview.widget.LinearLayoutManager
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class YolovActivity : Activity() {
    companion object {
        private const val SELECT_IMAGE = 1
    }

    // private var imageViews: GridLayout? = null
    // private var clearBtn: Button? = null
    private var execTv: TextView? = null

    private val uiHandler = Handler(Looper.getMainLooper())
    private val bitmaps = ArrayList<Bitmap>()
    private var yourSelectedImage: Bitmap? = null
    private val yolov5ncnn = YoloV5Ncnn()
    @Volatile private var isCPU = true
    @Volatile private var dealSuccess = true
    @Volatile private var shouldStopThread = false

    private lateinit var mAdapter: TextAdapter
    private lateinit var recyclerView: RecyclerView
    private val textList = mutableListOf<String>()

    /**
     * Called when the activity is first created.
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main)

        val retInit = yolov5ncnn.Init(assets)
        if (!retInit) {
            Log.e("YolovActivity", "yolov5ncnn Init failed")
        }

        // imageViews = findViewById(R.id.imageViews)
        // clearBtn = findViewById(R.id.clear_btn)
        execTv = findViewById(R.id.exec_tv)

        // val buttonImage = findViewById<Button>(R.id.buttonImage)
        // clearBtn?.setOnClickListener {
        //    execTv?.text = "已清空"
        //    bitmaps.clear()
        //    imageViews?.removeAllViews()
        // }

        mAdapter = TextAdapter()
        recyclerView = findViewById<RecyclerView>(R.id.recycler_view).apply {
            layoutManager = LinearLayoutManager(this@YolovActivity)
            adapter = mAdapter
        }

        dealSuccess = true
        uiHandler.removeCallbacksAndMessages(null)
        uiHandler.post(runnableTask)

        getAssetsPic()


        // val buttonDetect = findViewById<Button>(R.id.buttonDetect)
        // buttonDetect.setOnClickListener {
        //     if (bitmaps.isEmpty()) return@setOnClickListener
        //     dealSuccess = true
        //     isCPU = true
        //     uiHandler.removeCallbacksAndMessages(null)
        //     uiHandler.post(runnableTask)
        // }

        val buttonDetectGPU = findViewById<Button>(R.id.buttonDetectGPU)
        buttonDetectGPU.setOnClickListener {
            if (bitmaps.isEmpty()) return@setOnClickListener
            dealSuccess = true
            isCPU = false
            uiHandler.removeCallbacksAndMessages(null)
            uiHandler.post(runnableTask)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        // 这里执行销毁时的操作，例如释放资源
        Log.d("deal", "onDestroy")
        dealSuccess = false
        shouldStopThread = true
        uiHandler.removeCallbacksAndMessages(null)
    }

    private fun getAssetsPic() {
        val allImagesBitmapFromAssetsPic = AssetImageLoader.getAllImagesFromAssetsPic(this)
        for (bitmap in allImagesBitmapFromAssetsPic) {
            val img = ImageView(this)
            img.setImageBitmap(bitmap)
            val params = GridLayout.LayoutParams()
            val screenWidth = ScreenUtils.getScreenWidth(this)
            val screenHeight = ScreenUtils.getScreenHeight(this)
            params.width = screenWidth / 10
            params.height = screenHeight / 10
            img.layoutParams = params
            if (bitmaps.size > 100) {
                Toast.makeText(this, "最多选择100张", Toast.LENGTH_SHORT).show()
                return
            }
            bitmaps.add(bitmap)
            // imageViews?.addView(img)
        }
    }

    private fun formatTime(startTime: Long): String {
        val dateFormat = SimpleDateFormat("dd/MMM/yyyy:HH:mm:ss Z", Locale.ENGLISH)
        dateFormat.timeZone = TimeZone.getTimeZone("Asia/Shanghai")
        val formattedDate = dateFormat.format(Date(startTime))
        return "[$formattedDate]"
    }

    private val runnableTask = object : Runnable {


        override fun run() {
            if (bitmaps.isNotEmpty()) {
                execTv?.text = if (isCPU) " Run AI Job with CPU..." else " Run AI Job With GPU..."
                mAdapter.addText(if (isCPU) "${formatTime(System.currentTimeMillis())} [CPU] [YoloV5Ncnn] running" else "${formatTime(System.currentTimeMillis())} [GPU] [YoloV5Ncnn] running")
                mAdapter.notifyDataSetChanged()
                val startTime = System.currentTimeMillis()

                val t = Thread {
                    if (dealSuccess == true) {
                        dealSuccess = false
                        val processedBitmaps = ArrayList<Bitmap>()

                        for (bitmap in bitmaps) {
                            if (!shouldStopThread) {
                                val objects = yolov5ncnn.Detect(bitmap, isCPU)
                                val nBitmap = getDealBitmap(bitmap, objects)
                                nBitmap?.let { processedBitmaps.add(it) }
                            }
                        }

                        val endTime = System.currentTimeMillis()
                        val executionTime = endTime - startTime
                        // TODO 改日志
                        Log.d("deal", "结束执行代码，时间: $endTime")
                        Log.d("deal", "代码执行时间: $executionTime 毫秒")

                        uiHandler.post {
                            execTv?.text =
                                if (isCPU) "${formatTime(System.currentTimeMillis())} [CPU] [YoloV5Ncnn] cost ${executionTime} ms" else "${
                                    formatTime(System.currentTimeMillis())
                                } [GPU] [YoloV5Ncnn] cost ${executionTime} ms"
                            if (!shouldStopThread) {
                                dealSuccess = true
                            }
                            mAdapter.addText(
                                if (isCPU) "${formatTime(System.currentTimeMillis())} [CPU] [YoloV5Ncnn] cost ${executionTime} ms" else "${
                                    formatTime(
                                        System.currentTimeMillis()
                                    )
                                } [GPU] [YoloV5Ncnn] cost ${executionTime} ms"
                            )
                            mAdapter.notifyDataSetChanged()
                            recyclerView.scrollToPosition(mAdapter.itemCount - 1)
                            // imageViews?.removeAllViews()
                            // for (nBitmap in processedBitmaps) {
                            //    val img = ImageView(this@YolovActivity)
                            //    img.setImageBitmap(nBitmap)
                            //    val params = GridLayout.LayoutParams()
                            //    val screenWidth = ScreenUtils.getScreenWidth(this@YolovActivity)
                            //    val screenHeight = ScreenUtils.getScreenHeight(this@YolovActivity)
                            //    params.width = screenWidth / 10
                            //    params.height = screenHeight / 10
                            //    img.layoutParams = params
                            //    imageViews?.addView(img)
                            // }
                            // 再次执行任务
                            uiHandler.postDelayed(this, 1000)
                        }
                    }
                }
                if (dealSuccess) {
                    t.start()
                }
            }

        }
    }

    private fun getDealBitmap(bitmap: Bitmap, objects: Array<YoloV5Ncnn.Obj>?): Bitmap? {
        if (objects == null) {
            // imageView?.setImageBitmap(bitmap)
            return null
        }

        // draw objects on bitmap
        val rgba = bitmap.copy(Bitmap.Config.ARGB_8888, true)

        val colors = intArrayOf(
            Color.rgb(54, 67, 244),
            Color.rgb(99, 30, 233),
            Color.rgb(176, 39, 156),
            Color.rgb(183, 58, 103),
            Color.rgb(181, 81, 63),
            Color.rgb(243, 150, 33),
            Color.rgb(244, 169, 3),
            Color.rgb(212, 188, 0),
            Color.rgb(136, 150, 0),
            Color.rgb(80, 175, 76),
            Color.rgb(74, 195, 139),
            Color.rgb(57, 220, 205),
            Color.rgb(59, 235, 255),
            Color.rgb(7, 193, 255),
            Color.rgb(0, 152, 255),
            Color.rgb(34, 87, 255),
            Color.rgb(72, 85, 121),
            Color.rgb(158, 158, 158),
            Color.rgb(139, 125, 96)
        )

        val canvas = Canvas(rgba)

        val paint = Paint()
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 4f

        val textbgpaint = Paint()
        textbgpaint.color = Color.WHITE
        textbgpaint.style = Paint.Style.FILL

        val textpaint = Paint()
        textpaint.color = Color.BLACK
        textpaint.textSize = 26f
        textpaint.textAlign = Paint.Align.LEFT

        for (i in objects.indices) {
            paint.color = colors[i % 19]
            canvas.drawRect(objects[i].x, objects[i].y, objects[i].x + objects[i].w, objects[i].y + objects[i].h, paint)

            // draw filled text inside image
            val text = "${objects[i].label} = ${String.format("%.1f", objects[i].prob * 100)}%"

            val textWidth = textpaint.measureText(text)
            val textHeight = -textpaint.ascent() + textpaint.descent()

            var x = objects[i].x
            var y = objects[i].y - textHeight
            if (y < 0) y = 0f
            if (x + textWidth > rgba.width) x = rgba.width - textWidth

            canvas.drawRect(x, y, x + textWidth, y + textHeight, textbgpaint)
            canvas.drawText(text, x, y - textpaint.ascent(), textpaint)
        }

        return rgba
    }
}